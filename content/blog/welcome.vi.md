---
title: Lời chào: trang này để làm gì
date: 2026-10-15
description: Vài dòng về góc Phong thuỷ của tommitoan.com, về Bazica, và vì sao lá số ở đây đổi năm vào Lập Xuân.
---

Mình là Toan, một kỹ sư phần mềm viết Go. Ngoài giờ làm, mình dành nhiều thời gian cho Bát Tự: học kiến thức nền, rồi biến nó thành code để người khác dùng được.

## Bazica là gì

Bazica là một thư viện Go mã nguồn mở, chuyên tính lá số Bát Tự. [Bazica Web](https://bazi.tommitoan.com/chart) là trang web chạy trên thư viện đó: bạn nhập ngày giờ sinh, múi giờ và giới tính, là thấy ngay bốn trụ, các đại vận và từng năm.

Máy chủ của trang chỉ kiểm tra dữ liệu bạn nhập rồi gọi thư viện. Mọi phép tính Bát Tự đều nằm trong thư viện, nên ai cũng có thể đọc, kiểm tra và dùng lại ở chỗ khác.

## Vài điều nên biết khi đọc lá số

- **Năm Bát Tự đổi vào Lập Xuân**, khoảng 4 tháng 2, chứ không phải mùng một Tết. Trang này theo cách đó, và cũng ghi giờ Lập Xuân của năm sinh cùng năm âm lịch (Tết) để bạn đối chiếu.
- **Giờ sinh tính theo múi giờ nơi sinh.** Lệch hai tiếng là đổi luôn cả trụ giờ.
- **Năm sinh hỗ trợ từ 1700 đến 2399**, theo phạm vi của thư viện.
- **Liên kết chia sẻ không gửi ngày sinh lên máy chủ.** Ngày giờ sinh nằm sau dấu `#` trong địa chỉ, và trình duyệt không gửi phần này đi. Tuy vậy, ai nhận được liên kết đều đọc được các thông tin đó, nên hãy chỉ gửi cho người bạn tin.

## Ở đây sẽ có gì

Mình sẽ viết về cách đọc lá số, những chỗ dễ nhầm khi tính tiết khí, và chuyện làm một sản phẩm phong thuỷ bằng phần mềm. Bài nào có cả tiếng Việt lẫn tiếng Anh thì ở đầu trang có nút chuyển ngôn ngữ.

Muốn thử ngay thì [mở Bazica Web](https://bazi.tommitoan.com/chart). Mã nguồn thư viện nằm trên [GitHub](https://github.com/tommitoan/bazica).
