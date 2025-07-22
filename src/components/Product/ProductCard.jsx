import { Card, Button, Rate, Tag, Typography,Descriptions } from "antd";
import { Link } from "react-router-dom";

const { Meta } = Card;
const { Text, Title } = Typography;
import {useCart} from "../../hooks/useCart";
import { App as AntApp } from "antd";

const ProductCard = ({ product, page }) => {
  const { message } = AntApp.useApp();
  

  const { addToCart } = useCart();
  return (
    <Card
      hoverable
      cover={
        <Link to={`/product/${product.id}?page=${page}`}>
          <img
            alt={product.name}
            src={product.image}
            style={{
              height: 200,
              objectFit: "cover",
              padding: 10,
            }}
          />
        </Link>
      }
      actions={[
        <Link to={`/product/${product.id}?page=${page}`}>
          <Button type="primary">View Details</Button>
        </Link>,
        <Button
          type="default"
          disabled={product.stock === 0}
          onClick={() => {
            addToCart(product);
            message.success(`${product.name} added to cart!`);
          }}
        >
          Add to Cart
        </Button>,
      ]}
    >
      <Meta
        title={
          <Link to={`/product/${product.id}`}>
            <Title level={5} ellipsis={{ rows: 1 }}>
              {product.name}
            </Title>
          </Link>
        }
        description={
          <>
            <Descriptions.Item label="Rating">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </Descriptions.Item>
            <div style={{ margin: "8px 0" }}>
              <Text strong style={{ fontSize: 18 }}>
                ${product.price.toFixed(2)}
              </Text>
              {product.stock < 10 && product.stock > 0 && (
                <Tag color="orange" style={{ marginLeft: 8 }}>
                  Only {product.stock} left!
                </Tag>
              )}
              {product.stock === 0 && (
                <Tag color="red" style={{ marginLeft: 8 }}>
                  Out of stock
                </Tag>
              )}
            </div>
            <Text type="secondary">
              {product.description}
            </Text>
          </>
        }
      />
    </Card>
  );
};

export default ProductCard;
