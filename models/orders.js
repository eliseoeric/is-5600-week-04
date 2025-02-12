const Orders = {
    async create(order) {
      // Simulate database operation
      return { id: 1, ...order };
    },
  
    async list({ offset, limit, productId, status }) {
      // Simulate database operation
      return [
        { id: 1, productId: 1, status: 'pending' },
        { id: 2, productId: 2, status: 'completed' },
      ];
    },
  
    async update(id, updates) {
      // Simulate database operation
      return { id, ...updates };
    },
  
    async delete(id) {
      // Simulate database operation
      return { message: `Order with ID ${id} deleted` };
    },
  };
  
  module.exports = Orders;