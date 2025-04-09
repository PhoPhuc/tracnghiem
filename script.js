const qaList = document.getElementById('qaList');
const searchInput = document.getElementById('searchInput');
const showHiddenBtn = document.getElementById('showHiddenBtn');
const hiddenCountSpan = document.getElementById('hiddenCount');
const totalCountSpan = document.getElementById('totalCount');
let hiddenItems = [];
const qaData = [
    { question: 'Phenol là những hợp chất hữu cơ:', answer: 'Có một hay nhiều nhóm hydroxy liên kết trực tiếp với nguyên tử carbon của vòng benzene.' },
    { question: 'Phenol đơn giản nhất là hợp chất có:', answer: '1 nhóm hydroxy gắn vào vòng benzene không có nhóm thế.' },
    { question: 'Công thức cấu tạo thu gọn của phenol là:', answer: 'C6H5OH' },
    { question: 'Những chất nào sau đây thuôc loại monophenol?', answer: 'Phenol, o-cresol.' },
    { question: 'Những chất nào sau đây thuôc loại polyphenol?', answer: 'Resorcinol, catechol.' },
    { question: 'Chọn phát biểu sai về tính chất vật lí của phenol:', answer: 'Nhiệt độ sôi thấp hơn các aryl halide có phân tử khối tương đương.' },
    { question: 'Phenol có nhiệt độ nóng chảy cao hơn các aryl halide có phân tử khối tương đương là do:', answer: 'Tạo được liên kết hydrogen giữa các phân tử.' },
    { question: 'Phenol tan vô hạn trong nước ở:', answer: '66°C' },
    { question: 'Khi để lâu trong không khí, phenol sẽ chuyển sang màu gì?', answer: 'Màu hồng.' },
    { question: 'Khi để lâu trong không khí, phenol bị chuyển sang màu hồng do?', answer: 'Bị oxi hóa bởi oxygen trong không khí.' },
    { question: 'Phải rất cẩn thận khi làm các thí nghiệm với phenol do:', answer: 'Phenol rất độc và gây bỏng khi tiếp xúc với da' },
    { question: 'Do nhóm -OH liên kết trực tiếp với vòng benzene dẫn đến:', answer: 'Tăng sự phân cực của liên kết O-H' },
    { question: 'Benzene-1,3-diol còn có tên gọi khác là:', answer: 'Resorcinol' },
    { question: 'Phenol thể hiện tính:', answer: 'Acid yếu.' },
    { question: 'Một trong những hợp chất có tính acid mạnh nhất của phenol là:', answer: 'Picric acid' },
    { question: 'Chọn phát biểu sai về picric acid:', answer: 'Có công thức hóa học C6H3(NO2)2OH' },
    { question: 'Nhỏ nước bromine vào dung dịch phenol sẽ có hiện tượng gì?', answer: 'Xuất hiện kết tủa trắng.' },
    { question: 'Phenol phản ứng với nước bromine tạo ra sản phẩm:', answer: '2,4,6-tribromophenol.' },
    { question: 'Nguyên liệu chính để sản xuất bisphenol A là:', answer: 'Phenol' },
    { question: 'Trong công nghiệp, phenol được sản xuất từ:', answer: 'Cumene' },
    { question: 'Thuốc xịt chloraseptic chứa bao nhiêu phenol?', answer: '0.014' },
    { question: 'Phenol không phản ứng với chất nào sau đây?', answer: 'NaHCO3' },
    { question: 'Hợp chất hữu cơ X chứa vòng benzene, có công thức phân tử C7H8O, phản ứng được với dung dịch NaOH. Số chất thỏa mãn tính chất trên là:', answer: '3' },
    { question: 'Hợp chất hữu cơ X (phân tử chứa vòng benzene) có công thức phân tử là C7H8O2. Khi X tác dụng với Na dư, số mol H2 thu được bằng số mol X tham gia phản ứng. Mặt khác, X tác dụng được với dung dịch NaOH theo tỉ lệ số mol 1: 1. Công thức cấu tạo thu gọn của X là:', answer: 'HOC6H4CH2OH' },
    { question: 'Cho hỗn hợp X gồm ethanol và phenol tác dụng với Na (dư) thu được 3,36 lít khí hydrogen (đktc). Nếu hỗn hợp X trên tác dụng với nước bromine vừa đủ, thu được 19,86 gam kết tủa trắng 2,4,6-tribromophenol. Thành phần phần trăm theo khối lượng của phenol trong hỗn hợp là: (biết H=1, O=16, Br=80, C=12)', answer: '0.338' },
    { question: 'Ứng dụng nào sau đây không phải của phenol', answer: 'Bia, rượu' },
    { question: 'Để nhận biết ba lọ mất nhãn: phenol, styrene, benzyl alcohol, người ta dùng một thuốc thử duy nhất là:', answer: 'Nước bromine.' },
    { question: 'Hóa chất nào dưới đây dùng để phân biệt 2 lọ mất nhãn chứa dung dịch phenol và benzene.1)Na 2) Dung dịch NaOH 3) Nước bromine', answer: '1, 2 và 3' },
    { question: 'Ảnh hưởng của nhóm -OH đến gốc C6H5- thể hiện qua phản ứng giữa phenol với :', answer: 'Nước bromine' },
    { question: 'Một hợp chất X chứa ba nguyên tố C, H, O có tỉ lệ khối lượng mC: mH: mO = 21: 2: 4. Hợp chất X có công thức đơn giản nhất trùng với công thức phân tử. Số đồng phân cấu tạo thuộc loại hợp chất thơm ứng với công thức phân tử của X là:', answer: '5' },
    { question: 'Vòng benzene trở thành nhóm hút eletron là do:', answer: 'Nhóm -OH liên kết trực tiếp vòng benzene.' },
    { question: 'Thuốc xịt chloraseptic chứa 1,4% phenol được dùng làm:', answer: 'Thuốc chữa đau họng' },
    { question: 'Cho 15,5 gam hỗn hợp X và Y liên tiếp nhau trong dãy đồng đẳng của phenol đơn chức tác dụng vừa đủ với 0,5 lít dung dịch NaOH 0,3M. X và Y có công thức phân tử là:', answer: 'C6H5OH, C7H7OH' },
    { question: 'Ảnh hưởng của nhóm -OH đến gốc C6H5- và ảnh hưởng của gốc C6H5- đến nhóm -OH trong phân tử phenol thể hiện qua phản ứng giữa phenol với:', answer: 'Nước Br2, dung dịch NaOH' },
    { question: 'Một dung dịch X chứa 5,4 gam chất đồng đẳng của phenol đơn chức. Cho dung dịch X phản ứng với nước bromine (dư), thu được 17,25 gam hợp chất chứa 3 nguyên tử Br trong phân tử, giả sử phản ứng xảy ra hoàn toàn. Công thức phân tử X là:', answer: 'C7H7OH' },
    { question: 'Cho hỗn hợp gồm 0,2 mol phenol và 0,3 mol ethylene glycol tác dụng với lượng dư potassium thu được V lít H2 ở đktc. Giá trị của V là??', answer: '8.96' },
    { question: 'Phenol thể hiện tính acid qua phản ứng nào?', answer: 'Thế nguyên tử H ở nhóm -OH' },
    { question: 'Cho 15,4 gam hỗn hợp o-cresol và ethanol tác dụng với Na dư thu được m gam muối và 2,24 lít khí H2. Giá trị của m là:', answer: '19.8' },
    { question: 'Hãy chọn phát biểu sai:', answer: 'Phenol có tính acid yếu nhưng mạnh hơn H2CO3.' },
    { question: '0,54 gam 1 đồng đẳng của phenol đơn chức X phản ứng vừa đủ với 10ml NaOH 0,5M. Công thức phân tử của X là:', answer: 'C7H8O' },
    { question: 'Để nhận biết các chất ethanol, propenol, ethylene glycol, phenol có thể dùng các cặp chất:', answer: 'Nước Br2 và Cu(OH)2' },
    { question: 'Cho 0,01 mol phenol tác dụng với lượng dư dung dịch hỗn hợp HNO3 đặc và H2SO4 đặc. Phát biểu nào dưới đây không đúng?', answer: 'Khối lượng picric acid hình thành bằng 6,87 gam.' },
    { question: 'Cho 9,4 gam phenol (C6H5OH) tác dụng hết với bromine dư thì số mol bromine tham gia phản ứng là:', answer: '0,3 mol' },
    { question: 'Từ 1,2 kg cumene có thể điều chế được tối đa bao nhiêu gam phenol? Biết hiệu suất toàn bộ quá trình đạt 80%. (Mcumene = 120)', answer: '752 gam' },
    { question: 'Để điều chế picric acid (2,4,6–trinitrophenol) người ta đi từ 4,7 gam phenol và dùng một lượng HNO3 lớn hơn 50% so với lượng HNO3 cần thiết. Số mol HNO3 đã dùng và khối lượng picric acid thu được lần lượt là (các phản ứng xảy ra hoàn toàn), biết phân tử khối picric acid là 229.', answer: '0,225 mol và 11,45 gam' },
    { question: 'Chất nào sau đây tác dụng với dung dịch NaOH, Na và dung dịch Br2:', answer: 'C6H5OH' },
    { question: 'Để thu 22,9 gam picric acid cần m gam phenol. Tính m, biết hiệu suất phản ứng đạt 94%.', answer: '10 gam' },
    { question: 'No question specified', answer: 'o-cresol' },
    { question: 'Nhóm -OH liên kết trực tiếp với vòng benzene làm tăng mật độ eletron trong vòng, nhất là ở các vị trí:', answer: 'ortho và para' },
    { question: 'Cho các phát biểu sau:(a) Phenol tan nhiều trong nước lạnh.(b) Picric acid có tính acid mạnh hơn phenol(c) Cho nước bromine vào dung dịch phenol thấy xuất hiện kết tủa trắng.(d) Phenol làm quỳ tím hóa đỏ.(e) Hợp chấtC6H5−CH2−OHlà phenol.Số phát biểu đúng là:', answer: '2' }
];

console.log("Bắt đầu script.");
console.log("Dữ liệu qaData:", qaData);

function renderQAItems(data) {
    console.log("Hàm renderQAItems được gọi với:", data);
    qaList.innerHTML = '';
    data.forEach((item, index) => {
        console.log("Đang xử lý mục:", item, "ở index:", index);
        const qaItem = document.createElement('div');
        qaItem.classList.add('qa-item');
        qaItem.dataset.question = item.question.toLowerCase();
        qaItem.dataset.index = index;

        const hideButton = document.createElement('button');
        hideButton.classList.add('hide-button');
        hideButton.innerHTML = '<i class="fa fa-eye"></i>';
        hideButton.addEventListener('click', () => hideQAItem(index));

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = item.question;

        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answer');
        answerDiv.textContent = item.answer;

        qaItem.appendChild(hideButton);
        qaItem.appendChild(questionDiv);
        qaItem.appendChild(answerDiv);
        qaList.appendChild(qaItem);
        console.log("Đã thêm thẻ vào qaList:", qaItem);
    });
    updateHiddenCount();
    updateShowHiddenButtonVisibility();
    totalCountSpan.textContent = data.length; // Cập nhật tổng số lượng
    console.log("Số lượng thẻ sau khi render:", qaList.querySelectorAll('.qa-item').length);
    console.log("Nội dung qaList sau render:", qaList.innerHTML);
}

function hideQAItem(index) {
    console.log("Hàm hideQAItem được gọi với index:", index);
    const qaItem = document.querySelector(`.qa-item[data-index="${index}"]`);
    if (qaItem) {
        if (!qaItem.classList.contains('hidden')) {
            qaItem.classList.add('hidden');
            hiddenItems.push(parseInt(qaItem.dataset.index));
            console.log("Đã ẩn thẻ index:", index);
        } else {
            qaItem.classList.remove('hidden');
            hiddenItems = hiddenItems.filter(itemIndex => itemIndex !== parseInt(qaItem.dataset.index));
            console.log("Đã hiện thẻ index:", index);
        }
        updateHiddenCount();
        updateShowHiddenButtonVisibility();
        filterQAItems();
    } else {
        console.warn("Không tìm thấy thẻ với index:", index);
    }
}

function updateHiddenCount() {
    const count = hiddenItems.length;
    hiddenCountSpan.textContent = count;
    console.log("Số lượng thẻ ẩn:", count);
}

function updateShowHiddenButtonVisibility() {
    if (hiddenItems.length > 0) {
        showHiddenBtn.style.display = 'block';
        console.log("Hiển thị nút 'Hiện thẻ ẩn'.");
    } else {
        showHiddenBtn.style.display = 'none';
        console.log("Ẩn nút 'Hiện thẻ ẩn'.");
    }
}

showHiddenBtn.addEventListener('click', () => {
    console.log("Nút 'Hiện thẻ ẩn' được click.");
    const allQaItems = document.querySelectorAll('.qa-item.hidden');
    allQaItems.forEach(item => {
        item.classList.remove('hidden');
        console.log("Đã hiện thẻ:", item);
    });
    hiddenItems = [];
    updateHiddenCount();
    updateShowHiddenButtonVisibility();
    filterQAItems();
});

function filterQAItems() {
    const searchTerm = searchInput.value.toLowerCase();
    console.log("Hàm filterQAItems được gọi với searchTerm:", searchTerm);
    const allQaItems = document.querySelectorAll('.qa-item');

    allQaItems.forEach(item => {
        const question = item.dataset.question;
        const questionElement = item.querySelector('.question');
        const answerElement = item.querySelector('.answer');

        const isHidden = item.classList.contains('hidden');

        if (question.includes(searchTerm) && !isHidden) {
            item.style.display = 'block';
            const highlightedQuestion = question.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
            const highlightedAnswer = answerElement.textContent.replace(new RegExp(searchTerm, 'gi'), match => `<span class="highlight">${match}</span>`);
            questionElement.innerHTML = highlightedQuestion;
            answerElement.innerHTML = highlightedAnswer;
        } else if (!searchTerm && !isHidden) {
            item.style.display = 'block';
            questionElement.innerHTML = item.dataset.question;
            answerElement.innerHTML = answerElement.textContent; // Reset highlight
        } else {
            item.style.display = 'none';
            questionElement.innerHTML = item.dataset.question;
            answerElement.innerHTML = answerElement.textContent; // Reset highlight
        }
    });
}

searchInput.addEventListener('input', filterQAItems);

console.log("Gọi hàm renderQAItems ban đầu.");
renderQAItems(qaData);
console.log("Giá trị của totalCountSpan sau render:", totalCountSpan.textContent);
console.log("Giá trị ban đầu của hiddenCountSpan:", hiddenCountSpan.textContent);
console.log("Kết thúc script.");
