// Dùng Object.freeze để đảm bảo các giá trị này không bị vô tình thay đổi trong lúc code chạy
const TRANG_THAI_THAM_GAP = Object.freeze({
  CHO_DUYET: 'Chờ duyệt',
  DA_DUYET: 'Đã duyệt',
  TU_CHOI: 'Từ chối',
  HOAN_THANH: 'Hoàn thành'
});

// Nếu sau này có thêm các hằng số khác (như Role), bạn cứ viết thêm ở đây
const ROLE = Object.freeze({
  ADMIN: true,
  USER: false
});

module.exports = {
  TRANG_THAI_THAM_GAP,
  ROLE
};