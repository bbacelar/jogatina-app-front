export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    mask: {
      type: String,
      default: 'YYYY-MM-DD HH:mm'
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm'
    }
  }
};
