document.addEventListener('DOMContentLoaded', () => {
    // --- Tham chiếu DOM (Giữ nguyên) ---
    const quizContainer = document.getElementById('quiz');
    const submitButton = document.getElementById('submit-btn');
    const retryButton = document.getElementById('retry-btn');
    const scoreContainer = document.getElementById('score-container');
    const resultContainer = document.getElementById('result-container');
    // Giữ tham chiếu đến span để reset dễ dàng
    // const scoreElement = document.getElementById('score');
    // const totalQuestionsElement = document.getElementById('total-questions');


    // --- Dữ liệu câu hỏi (Cập nhật với type và cấu trúc TF) ---
    const questions = [
        {
            type: 'mc', // Multiple Choice
            question: "Thủ đô của Việt Nam là gì?",
            options: ["Thành phố Hồ Chí Minh", "Đà Nẵng", "Hà Nội", "Hải Phòng"],
            correctAnswer: 2 // Index
        },
        {
            type: 'tf', // True/False
            question: "Đánh giá các mệnh đề sau về Hệ Mặt Trời:", // Chủ đề chung
            statements: [
                { text: "Sao Hỏa là hành tinh lớn nhất trong Hệ Mặt Trời.", correctAnswer: false }, // Mệnh đề 1
                { text: "Trái Đất là hành tinh thứ ba tính từ Mặt Trời.", correctAnswer: true },   // Mệnh đề 2
                { text: "Sao Kim có nhiệt độ bề mặt nóng hơn Sao Thủy.", correctAnswer: true },    // Mệnh đề 3
                { text: "Mặt Trăng của Trái Đất tự phát ra ánh sáng.", correctAnswer: false }     // Mệnh đề 4
            ]
        },
        {
            type: 'mc',
            question: "1 + 1 bằng mấy?",
            options: ["1", "2", "3", "0"],
            correctAnswer: 1
        },
         {
            type: 'tf', // True/False
            question: "Xác định tính đúng sai của các phát biểu về Việt Nam:",
            statements: [
                { text: "Việt Nam nằm ở khu vực Đông Nam Á.", correctAnswer: true },
                { text: "Đồng bằng sông Cửu Long là vựa lúa lớn nhất cả nước.", correctAnswer: true },
                { text: "Thành phố Hồ Chí Minh là thủ đô của Việt Nam.", correctAnswer: false },
                { text: "Việt Nam có đường bờ biển dài hơn 5000 km.", correctAnswer: false } // Thực tế khoảng 3260km
            ]
        },
        {
            type: 'mc',
            question: "Ngôn ngữ lập trình nào phổ biến nhất cho web front-end?",
            options: ["Python", "Java", "C++", "JavaScript"],
            correctAnswer: 3
        },

    ];

    // --- Hàm tính tổng số mục có thể chấm điểm ---
    function getTotalScorableItems() {
        let total = 0;
        questions.forEach(q => {
            if (q.type === 'mc') {
                total++;
            } else if (q.type === 'tf') {
                total += q.statements.length; // Mỗi mệnh đề là 1 mục
            }
        });
        return total;
    }

    // --- Hàm hiển thị câu hỏi (Cập nhật để xử lý cả 2 type) ---
    function displayQuestions() {
        quizContainer.innerHTML = '';
        const totalItems = getTotalScorableItems(); // Tính tổng số mục chấm điểm

        // Reset điểm số và nội dung hiển thị ban đầu
        // Hiển thị tổng số mục chấm điểm thay vì số câu hỏi chính
        scoreContainer.innerHTML = `Điểm của bạn: <span id="score">0</span> / <span id="total-items">${totalItems}</span> mục`;

        let questionCounter = 0; // Biến đếm số thứ tự câu hỏi chính

        questions.forEach((q, index) => {
            questionCounter++;
            const questionBlock = document.createElement('div');
            questionBlock.classList.add('question-block'); // Thẻ cho câu hỏi

            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            // Hiển thị số thứ tự câu hỏi chính
            questionText.textContent = `${questionCounter}. ${q.question}`;
            questionBlock.appendChild(questionText);

            // --- Xử lý hiển thị dựa trên type ---
            if (q.type === 'mc') {
                const optionsDiv = document.createElement('div');
                optionsDiv.classList.add('options');

                q.options.forEach((option, optionIndex) => {
                    const label = document.createElement('label');
                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.name = `question-${index}`; // Name cho câu MC
                    radioInput.value = optionIndex;

                    label.appendChild(radioInput);
                    label.appendChild(document.createTextNode(` ${option}`));
                    optionsDiv.appendChild(label);
                });
                questionBlock.appendChild(optionsDiv);

            } else if (q.type === 'tf') {
                const statementsContainer = document.createElement('div');
                statementsContainer.classList.add('statements-container');

                q.statements.forEach((statement, subIndex) => {
                    const statementItem = document.createElement('div');
                    statementItem.classList.add('statement-item');

                    const statementText = document.createElement('span');
                    statementText.classList.add('statement-text');
                    statementText.textContent = statement.text;
                    statementItem.appendChild(statementText);

                    const tfOptionsDiv = document.createElement('div');
                    tfOptionsDiv.classList.add('tf-options');

                    // Tạo input Đúng (True)
                    const trueLabel = document.createElement('label');
                    trueLabel.classList.add('tf-label');
                    const trueInput = document.createElement('input');
                    trueInput.type = 'radio';
                    // Name phải duy nhất cho từng mệnh đề: question-[index]-statement-[subIndex]
                    trueInput.name = `question-${index}-statement-${subIndex}`;
                    trueInput.value = 'true';
                    trueLabel.appendChild(trueInput);
                    trueLabel.appendChild(document.createTextNode(' Đúng'));
                    tfOptionsDiv.appendChild(trueLabel);

                    // Tạo input Sai (False)
                    const falseLabel = document.createElement('label');
                    falseLabel.classList.add('tf-label');
                    const falseInput = document.createElement('input');
                    falseInput.type = 'radio';
                    falseInput.name = `question-${index}-statement-${subIndex}`; // Cùng name với True
                    falseInput.value = 'false';
                    falseLabel.appendChild(falseInput);
                    falseLabel.appendChild(document.createTextNode(' Sai'));
                    tfOptionsDiv.appendChild(falseLabel);

                    statementItem.appendChild(tfOptionsDiv);
                    statementsContainer.appendChild(statementItem);
                });
                questionBlock.appendChild(statementsContainer);
            }

            quizContainer.appendChild(questionBlock);
        });

        // Reset trạng thái nút và kết quả
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
        retryButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
        submitButton.disabled = false;
    }

    // --- Hàm tính điểm và hiển thị kết quả (Cập nhật để xử lý cả 2 type) ---
    function calculateScore() {
        let currentScore = 0; // Tổng điểm thô
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'block';

        const totalItems = getTotalScorableItems(); // Lấy tổng số mục chấm điểm
        let questionCounter = 0; // Biến đếm số thứ tự câu hỏi chính

        questions.forEach((q, index) => {
            questionCounter++;
             // --- Xử lý điểm và kết quả dựa trên type ---
             if (q.type === 'mc') {
                 const resultP = document.createElement('p'); // Tạo p riêng cho mỗi câu MC
                 resultP.innerHTML = `<strong>Câu ${questionCounter} (Trắc nghiệm):</strong> ${q.question}<br>`;

                 const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
                 const allOptionsInputs = document.querySelectorAll(`input[name="question-${index}"]`);

                 // Vô hiệu hóa lựa chọn MC
                 allOptionsInputs.forEach(input => input.disabled = true);

                 if (selectedOption) {
                    const userAnswerIndex = parseInt(selectedOption.value);
                    const correctAnswerText = q.options[q.correctAnswer];
                    const userAnswerText = q.options[userAnswerIndex];

                    resultP.innerHTML += `&nbsp;&nbsp;Bạn chọn: <span class="user-answer">${userAnswerText}</span>. `;

                    if (userAnswerIndex === q.correctAnswer) {
                        currentScore++; // Tăng điểm
                        resultP.innerHTML += `<span class="correct">Đúng!</span>`;
                    } else {
                        resultP.innerHTML += `<span class="incorrect">Sai.</span> Đáp án đúng là: <span class="correct">${correctAnswerText}</span>`;
                    }
                 } else {
                    const correctAnswerText = q.options[q.correctAnswer];
                    resultP.innerHTML += `&nbsp;&nbsp;<span class="incorrect">Bạn chưa trả lời.</span> Đáp án đúng là: <span class="correct">${correctAnswerText}</span>`;
                 }
                 resultContainer.appendChild(resultP); // Thêm kết quả câu MC vào container

             } else if (q.type === 'tf') {
                 const resultP = document.createElement('div'); // Dùng div để chứa nhiều dòng kết quả cho TF
                 resultP.innerHTML = `<strong>Câu ${questionCounter} (Đúng/Sai):</strong> ${q.question}<br>`;

                 q.statements.forEach((statement, subIndex) => {
                     const statementResultDiv = document.createElement('div'); // div cho kết quả từng mệnh đề
                     statementResultDiv.classList.add('statement-result-item');
                     statementResultDiv.innerHTML = `&nbsp;&nbsp;- ${statement.text}: `;

                     const selectedTF = document.querySelector(`input[name="question-${index}-statement-${subIndex}"]:checked`);
                     const allTFInputs = document.querySelectorAll(`input[name="question-${index}-statement-${subIndex}"]`);

                     // Vô hiệu hóa lựa chọn T/F
                     allTFInputs.forEach(input => input.disabled = true);

                     const correctAnswerBool = statement.correctAnswer; // boolean
                     const correctAnswerText = correctAnswerBool ? "Đúng" : "Sai";

                     if (selectedTF) {
                        const userAnswerValue = selectedTF.value; // "true" hoặc "false" (string)
                        const userAnswerBool = (userAnswerValue === 'true'); // Chuyển sang boolean

                        statementResultDiv.innerHTML += `Bạn chọn <span class="user-answer">${userAnswerValue === 'true' ? 'Đúng' : 'Sai'}</span>. `;

                        if (userAnswerBool === correctAnswerBool) {
                            currentScore++; // Tăng điểm
                            statementResultDiv.innerHTML += `<span class="correct">Chính xác!</span>`;
                        } else {
                            statementResultDiv.innerHTML += `<span class="incorrect">Không đúng.</span> Đáp án là: <span class="correct">${correctAnswerText}</span>`;
                        }
                     } else {
                        statementResultDiv.innerHTML += `<span class="incorrect">Bạn chưa trả lời.</span> Đáp án là: <span class="correct">${correctAnswerText}</span>`;
                     }
                      resultP.appendChild(statementResultDiv); // Thêm kết quả mệnh đề vào div chung của câu TF
                 });
                 resultContainer.appendChild(resultP); // Thêm kết quả câu TF vào container
             }
        });

        // --- Tính điểm thang 10 dựa trên tổng số mục chấm điểm ---
        let scaledScore = 0;
        if (totalItems > 0) {
            scaledScore = (currentScore / totalItems) * 10;
        }
        const roundedScaledScore = scaledScore.toFixed(1);

        // --- Cập nhật hiển thị điểm ---
        scoreContainer.innerHTML = `Kết quả: ${currentScore} / ${totalItems} mục đúng - <strong style="font-size: 1.1em;">Điểm (Thang 10): ${roundedScaledScore}</strong>`;

        // --- Cập nhật trạng thái nút ---
        submitButton.style.display = 'none';
        retryButton.style.display = 'inline-block';

        // --- Cuộn xuống kết quả ---
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Hàm xử lý khi nhấn nút Làm lại (Giữ nguyên) ---
    function retryQuiz() {
        displayQuestions();
        quizContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // --- Gắn sự kiện (Giữ nguyên) ---
    submitButton.addEventListener('click', calculateScore);
    retryButton.addEventListener('click', retryQuiz);

    // --- Hiển thị câu hỏi ban đầu ---
    displayQuestions();
});
