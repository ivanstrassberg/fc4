import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const sliderStyle = {
  width: '100%',
  height: '50px',
  // backgroundColor: '#f6f6f6',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  margin: '65px',
  zIndex: 999,
};

const sliderButtonStyle = {
  border: 'none',
  backgroundColor: '#a1bd4d',
  cursor: 'pointer',
  padding: '5px 10px',
  margin: '0 5px',
  borderRadius: '5px',
};

function CategorySlider({ onChange }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSliderChange = (categoryId) => {
    setSelectedCategory(categoryId);
    onChange(categoryId);
  };

  const handleCancel = () => {
    setSelectedCategory(null);
    onChange(null);
  };

  const getEmoji = (categoryId) => {
    switch (categoryId) {
      case 1:
        return '🍲';
      case 2:
        return '🥤';
      case 3:
        return '🍎';
      default:
        return '';
    }
  };

  return (
    <div style={sliderStyle}>
      <button
        style={sliderButtonStyle}
        onClick={() => handleSliderChange(1)}
      >
        {selectedCategory === 1 ? '🍲' : 'Meals'}
      </button>
      <button
        style={sliderButtonStyle}
        onClick={() => handleSliderChange(2)}
      >
        {selectedCategory === 2 ? '🥤' : 'Drinks'}
      </button>
      <button
        style={sliderButtonStyle}
        onClick={() => handleSliderChange(3)}
      >
        {selectedCategory === 3 ? '🍎' : 'Fruits'}
      </button>
      <button
        style={sliderButtonStyle}
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  padding: '20px',
};

const cardStyle = {
  flex: '1 0 calc(33.33% - 20px)', // Adjust flex-basis for large screens (3 items per row)
  maxWidth: '400px',
  margin: '10px',
  border: '1px solid #ddd',
  borderRadius: '5px',
  padding: '10px',
  display: 'flex',
};

const imageContainerStyle = {
  marginRight: '20px',
};

const imageStyle = {
  width: '200px',
  height: 'auto',
  borderRadius: '10%',
  minWidth: '150px',
};

const textContainerStyle = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const buttonStyle = {
  backgroundColor: '#a1bd4d',
  border: 'none',
  borderRadius: '5px',
  color: 'white',
  padding: '10px 20px',
  cursor: 'pointer',
};

const buttonHoverStyle = {
  ...buttonStyle,
  opacity: '0.8',
};

const categoryEmoji = {
  meals: '🍲',
  drinks: '🥤',
  fruits: '🍎',
};

function ProductCard({ product, inCart, onAddToCart }) {
  const navigate = useNavigate();
  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  const handleButtonClick = () => {
    if (inCart) {
      navigate('/cart');
    } else {
      onAddToCart(product.id);
    }
  };

  return (
    <div style={cardStyle}>
      <div style={imageContainerStyle}>
        <img src={`/img/${product.id}.png`} alt={product.name} style={imageStyle} />
      </div>
      <div style={textContainerStyle}>
        <Link to={`/product/${product.id}`} style={linkStyle}>
          <h2>{product.name} {categoryEmoji[product.category]}</h2>
        </Link>
        <p>Price: {product.price.toFixed(2)} руб.</p>
        <button style={inCart ? buttonHoverStyle : buttonStyle} onClick={handleButtonClick}>
          {inCart ? "To Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetch('https://go-foodstore-server-production.up.railway.app/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
    
    fetch('https://go-foodstore-server-production.up.railway.app/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': localStorage.getItem('X-Authorization'),
        'email': localStorage.getItem('email'),
      },
    })
      .then((response) => response.json())
      .then((cartData) => {
        setCart(cartData.map(item => item.id));
      })
      .catch((error) => {
        console.error('Error fetching cart:', error);
      });
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      const response = await fetch(`https://go-foodstore-server-production.up.railway.app/cart/add/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': localStorage.getItem('X-Authorization'),
          'email': localStorage.getItem('email'),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      setCart(prevCart => [...prevCart, productId]);
      console.log('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category_id === selectedCategory)
    : products;

  return (
    <div>
      <CategorySlider
            onChange={setSelectedCategory} 
            />
            <div style={containerStyle}>
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  inCart={cart.includes(product.id)} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </div>
          </div>
        );
      }
      
      export default ProductList;
      
