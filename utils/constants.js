const TRANG_THAI_THAM_GAP = Object.freeze({
  CHO_DUYET: 'Chờ duyệt',
  DA_DUYET: 'Đã duyệt',
  TU_CHOI: 'Từ chối',
  HOAN_THANH: 'Hoàn thành',
  DA_HUY: 'Đã hủy' // Trạng thái mới thêm
});

const ROLE = Object.freeze({
  ADMIN: true,
  USER: false
});

module.exports = { TRANG_THAI_THAM_GAP, ROLE };