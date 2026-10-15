---
title: Lời chào: trang này để làm gì
date: 2026-10-15
description: Vài dòng về góc Phong thuỷ của tommitoan.com, về Bazica, và vì sao lá số ở đây đổi năm vào Lập Xuân.
---

Mình là Toan, một kỹ sư phần mềm viết Go. Ngoài công việc, mình dành nhiều thời gian cho Bát Tự: tìm hiểu kiến thức nền, rồi biến nó thành code mà người khác dùng được.

## Bazica là gì

Bazica là một thư viện Go mã nguồn mở tính lá số Bát Tự. [Bazica Web](https://bazi.tommitoan.com/chart) là trang web chạy trên thư viện đó: bạn nhập ngày giờ sinh, múi giờ và giới tính là thấy bốn trụ, các đại vận và từng năm.

Máy chủ của trang chỉ kiểm tra dữ liệu nhập rồi gọi thư viện. Mọi phép tính Bát Tự nằm trong thư viện, nên có thể đọc, kiểm tra và dùng lại ở nơi khác.

## Vài điều nên biết khi đọc lá số

- **Năm Bát Tự đổi vào Lập Xuân**, khoảng ngày 4 tháng 2, không phải mùng một Tết. Trang này theo cách đó. Trang cũng ghi giờ Lập Xuân của năm sinh và năm âm lịch (Tết) để bạn đối chiếu.
- **Giờ sinh tính theo múi giờ nơi sinh.** Lệch hai tiếng là đổi cả trụ giờ.
- **Khoảng năm sinh hỗ trợ là 1700 đến 2399**, lấy từ thư viện.
- **Liên kết chia sẻ không gửi ngày sinh lên máy chủ.** Ngày giờ sinh nằm trong phần sau dấu `#` của địa chỉ, trình duyệt không gửi phần đó đi. Ai nhận được liên kết thì đọc được các trường đó, nên hãy gửi cho người bạn tin.

## Ở đây sẽ có gì

Mình sẽ viết về cách đọc lá số, về những chỗ dễ nhầm khi tính tiết khí, và về chuyện làm một sản phẩm phong thuỷ bằng phần mềm. Bài nào có cả tiếng Việt và tiếng Anh thì có nút chuyển ngôn ngữ ở đầu trang.

Nếu bạn muốn thử ngay, [mở Bazica Web](https://bazi.tommitoan.com/chart). Mã nguồn thư viện ở [GitHub](https://github.com/tommitoan/bazica).
