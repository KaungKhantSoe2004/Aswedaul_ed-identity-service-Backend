export const createGalleries = `CREATE TABLE IF NOT EXISTS galleries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  galleryName VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
