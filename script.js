document.addEventListener('DOMContentLoaded', () => {
    // --- Tham chiếu DOM ---
    const infoScreen = document.getElementById('info-screen');
    const quizSection = document.getElementById('quiz-section');
    const startBtn = document.getElementById('start-btn');
    const timerContainer = document.getElementById('timer-container');
    const timeLeftElement = document.getElementById('time-left');
    const quizContainer = document.getElementById('quiz');
    const submitButton = document.getElementById('submit-btn');
    const retryButton = document.getElementById('retry-btn');
    const scoreContainer = document.getElementById('score-container');
    const filterContainer = document.getElementById('filter-container'); // Bộ lọc
    const resultContainer = document.getElementById('result-container');

    // --- Cấu hình Quiz ---
    const QUIZ_TITLE = "Bài Kiểm Tra Kiến Thức Tổng Hợp";
    const TIME_LIMIT_MINUTES = 45;
    let timerIntervalId = null;
    let remainingTime = TIME_LIMIT_MINUTES * 60;

    // --- Dữ liệu câu hỏi (Giữ nguyên) ---
    const questions = [
         { type: 'mc', question: "Thủ đô của Việt Nam là gì?", options: ["TP. Hồ Chí Minh", "Đà Nẵng", "Hà Nội", "Hải Phòng"], correctAnswer: 2 },
         { type: 'tf', question: "Đánh giá các mệnh đề về Hệ Mặt Trời:", statements: [ { text: "Sao Hỏa lớn nhất Hệ Mặt Trời.", correctAnswer: false }, { text: "Trái Đất là hành tinh thứ 3.", correctAnswer: true }, { text: "Sao Kim nóng hơn Sao Thủy.", correctAnswer: true }, { text: "Mặt Trăng tự phát sáng.", correctAnswer: false } ] },
         { type: 'mc', question: "1 + 1 bằng mấy?", options: ["1", "2", "3", "0"], correctAnswer: 1 },
         { type: 'tf', question: "Xác định tính đúng sai về Việt Nam:", statements: [ { text: "Việt Nam ở Đông Nam Á.", correctAnswer: true }, { text: "ĐBSCL là vựa lúa lớn nhất.", correctAnswer: true }, { text: "TP. HCM là thủ đô.", correctAnswer: false }, { text: "Bờ biển dài > 5000 km.", correctAnswer: false } ] },
         { type: 'mc', question: "Ngôn ngữ phổ biến nhất cho web front-end?", options: ["Python", "Java", "C++", "JavaScript"], correctAnswer: 3 },
    ];

    // --- Hàm tính tổng số mục chấm điểm (Giữ nguyên) ---
    function getTotalScorableItems() {
        let total = 0;
        questions.forEach(q => {
            if (q.type === 'mc') total++;
            else if (q.type === 'tf') total += q.statements.length;
        });
        return total;
    }
    // --- Hàm tính tổng số câu hỏi chính ---
    function getTotalMainQuestions() {
        return questions.length;
    }


    // --- Hàm cập nhật màn hình thông tin ---
    function updateInfoScreen() {
        document.getElementById('quiz-title').textContent = QUIZ_TITLE;
        // Hiển thị số câu hỏi chính thay vì số mục
        document.getElementById('info-total-questions').textContent = getTotalMainQuestions();
        document.getElementById('info-time-limit').textContent = TIME_LIMIT_MINUTES;
    }

    // --- Hàm hiển thị câu hỏi (Giữ nguyên) ---
    function displayQuestions() {
        quizContainer.innerHTML = '';
        let questionCounter = 0;
        questions.forEach((q, index) => {
            questionCounter++;
            const questionBlock = document.createElement('div');
            questionBlock.classList.add('question-block');
             const questionText = document.createElement('p');
             questionText.classList.add('question-text');
             questionText.textContent = `${questionCounter}. ${q.question}`;
             questionBlock.appendChild(questionText);

             if (q.type === 'mc') {
                 const optionsDiv = document.createElement('div');
                 optionsDiv.classList.add('options');
                 q.options.forEach((option, optionIndex) => {
                     const label = document.createElement('label');
                     const radioInput = document.createElement('input');
                     radioInput.type = 'radio';
                     radioInput.name = `question-${index}`;
                     radioInput.value = optionIndex;
                     label.id = `q${index}_opt${optionIndex}`;
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
                     // True
                     const trueLabel = document.createElement('label');
                     trueLabel.classList.add('tf-label');
                     const trueInput = document.createElement('input');
                     trueInput.type = 'radio';
                     trueInput.name = `question-${index}-statement-${subIndex}`;
                     trueInput.value = 'true';
                     trueLabel.id = `q${index}_s${subIndex}_true`;
                     trueLabel.appendChild(trueInput);
                     trueLabel.appendChild(document.createTextNode(' Đúng'));
                     tfOptionsDiv.appendChild(trueLabel);
                     // False
                     const falseLabel = document.createElement('label');
                     falseLabel.classList.add('tf-label');
                     const falseInput = document.createElement('input');
                     falseInput.type = 'radio';
                     falseInput.name = `question-${index}-statement-${subIndex}`;
                     falseInput.value = 'false';
                     falseLabel.id = `q${index}_s${subIndex}_false`;
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
        resultContainer.style.display = 'none';
        resultContainer.innerHTML = '';
        scoreContainer.style.display = 'none';
        filterContainer.style.display = 'none'; // Ẩn bộ lọc khi bắt đầu
        retryButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
        submitButton.disabled = false;
    }

    // --- Hàm bắt đầu bộ đếm thời gian (Giữ nguyên) ---
    function startTimer() {
        remainingTime = TIME_LIMIT_MINUTES * 60;
        updateTimerDisplay();
        timerIntervalId = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            if (remainingTime <= 0) handleTimeUp();
        }, 1000);
    }

    // --- Hàm cập nhật hiển thị thời gian (Giữ nguyên) ---
    function updateTimerDisplay() {
        if (remainingTime < 0) remainingTime = 0;
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        timeLeftElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (remainingTime <= 60 && remainingTime > 0) {
            timerContainer.style.backgroundColor = 'var(--incorrect-option-bg)';
            timerContainer.style.borderColor = 'var(--incorrect-color)';
            timerContainer.style.color = 'var(--incorrect-color)';
        } else {
            timerContainer.style.backgroundColor = 'var(--timer-bg)';
            timerContainer.style.borderColor = 'var(--timer-border)';
            timerContainer.style.color = 'var(--timer-text)';
        }
    }

    // --- Hàm xử lý khi hết giờ (Giữ nguyên) ---
    function handleTimeUp() {
        clearInterval(timerIntervalId);
        alert("Đã hết thời gian làm bài! Bài thi sẽ được nộp tự động.");
        calculateScore(true);
    }

    // --- Hàm tính điểm và hiển thị kết quả (Cập nhật cách tính điểm & thêm data-correctness) ---
    function calculateScore(isAutoSubmit = false) {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }

        let totalScore = 0; // Điểm tổng (thang 10)
        resultContainer.innerHTML = '';

        const totalMainQuestions = getTotalMainQuestions();
        const pointsPerMainQuestion = totalMainQuestions > 0 ? (10 / totalMainQuestions) : 0;
        let questionCounter = 0;

        questions.forEach((q, index) => {
            questionCounter++;
            let isQuestionCorrect = false; // Cờ để đánh dấu câu hỏi đúng/sai cho bộ lọc
            let questionPoints = 0; // Điểm đạt được cho câu hỏi này

             if (q.type === 'mc') {
                 const resultP = document.createElement('p');
                 resultP.innerHTML = `<strong>Câu ${questionCounter} (Trắc nghiệm):</strong> ${q.question}<br>`;
                 const selectedOptionInput = document.querySelector(`input[name="question-${index}"]:checked`);
                 const allOptionsInputs = document.querySelectorAll(`input[name="question-${index}"]`);
                 const correctAnswerIndex = q.correctAnswer;
                 let userAnswerIndex = -1;

                 allOptionsInputs.forEach((input, optIndex) => {
                     input.disabled = true;
                     const label = input.closest('label');
                     if (optIndex === correctAnswerIndex) label.classList.add('correct-option');
                     if (input.checked) {
                         userAnswerIndex = parseInt(input.value);
                         if (userAnswerIndex !== correctAnswerIndex) label.classList.add('incorrect-option');
                     }
                 });

                 if (userAnswerIndex !== -1) {
                    const correctAnswerText = q.options[correctAnswerIndex];
                    const userAnswerText = q.options[userAnswerIndex];
                    resultP.innerHTML += `&nbsp;&nbsp;Bạn chọn: <span class="user-answer">${userAnswerText}</span>. `;
                    if (userAnswerIndex === correctAnswerIndex) {
                        questionPoints = pointsPerMainQuestion; // Đạt điểm tối đa cho câu MC
                        isQuestionCorrect = true; // Đánh dấu câu đúng
                        resultP.innerHTML += `<span class="correct">Đúng!</span>`;
                    } else {
                        isQuestionCorrect = false; // Đánh dấu câu sai
                        resultP.innerHTML += `<span class="incorrect">Sai.</span> Đáp án đúng là: <span class="correct">${correctAnswerText}</span>`;
                    }
                 } else {
                     isQuestionCorrect = false; // Chưa trả lời = sai
                    const correctAnswerText = q.options[correctAnswerIndex];
                    resultP.innerHTML += `&nbsp;&nbsp;<span class="incorrect">Bạn chưa trả lời.</span> Đáp án đúng là: <span class="correct">${correctAnswerText}</span>`;
                 }
                 // Thêm data attribute cho bộ lọc
                 resultP.dataset.correctness = isQuestionCorrect ? 'correct' : 'incorrect';
                 resultContainer.appendChild(resultP);

             } else if (q.type === 'tf') {
                 const resultDiv = document.createElement('div');
                 resultDiv.innerHTML = `<strong>Câu ${questionCounter} (Đúng/Sai):</strong> ${q.question}<br>`;
                 let pointsForThisTF = 0; // Điểm cho câu TF này
                 const pointsPerStatement = pointsPerMainQuestion * 0.25; // 25% điểm câu hỏi chính cho mỗi mệnh đề
                 let correctStatementsCount = 0; // Đếm số mệnh đề đúng

                 q.statements.forEach((statement, subIndex) => {
                     const statementResultDiv = document.createElement('div');
                     statementResultDiv.classList.add('statement-result-item');
                     statementResultDiv.innerHTML = `&nbsp;&nbsp;- ${statement.text}: `;
                     const selectedTFInput = document.querySelector(`input[name="question-${index}-statement-${subIndex}"]:checked`);
                     const allTFInputs = document.querySelectorAll(`input[name="question-${index}-statement-${subIndex}"]`);
                     const correctAnswerBool = statement.correctAnswer;
                     const trueLabel = document.getElementById(`q${index}_s${subIndex}_true`);
                     const falseLabel = document.getElementById(`q${index}_s${subIndex}_false`);

                     allTFInputs.forEach(input => input.disabled = true);
                     if (correctAnswerBool === true && trueLabel) trueLabel.classList.add('correct-option');
                     else if (correctAnswerBool === false && falseLabel) falseLabel.classList.add('correct-option');

                     let userAnswerBool = null;
                     if (selectedTFInput) {
                         userAnswerBool = (selectedTFInput.value === 'true');
                         const selectedLabel = selectedTFInput.closest('label');
                         statementResultDiv.innerHTML += `Bạn chọn <span class="user-answer">${userAnswerBool ? 'Đúng' : 'Sai'}</span>. `;
                         if (userAnswerBool === correctAnswerBool) {
                             pointsForThisTF += pointsPerStatement; // Cộng điểm cho mệnh đề đúng
                             correctStatementsCount++;
                             statementResultDiv.innerHTML += `<span class="correct">Chính xác!</span>`;
                         } else {
                             if (selectedLabel) selectedLabel.classList.add('incorrect-option');
                             statementResultDiv.innerHTML += `<span class="incorrect">Không đúng.</span> Đáp án là: <span class="correct">${correctAnswerBool ? "Đúng" : "Sai"}</span>`;
                         }
                     } else {
                         statementResultDiv.innerHTML += `<span class="incorrect">Bạn chưa trả lời.</span> Đáp án là: <span class="correct">${correctAnswerBool ? "Đúng" : "Sai"}</span>`;
                     }
                     resultDiv.appendChild(statementResultDiv);
                 });
                 questionPoints = pointsForThisTF; // Gán điểm đạt được cho câu TF
                 // Đánh dấu câu hỏi TF là 'correct' nếu đúng ít nhất 1 mệnh đề
                 isQuestionCorrect = correctStatementsCount > 0;
                 resultDiv.dataset.correctness = isQuestionCorrect ? 'correct' : 'incorrect';
                 resultContainer.appendChild(resultDiv);
             }
             totalScore += questionPoints; // Cộng điểm của câu hỏi này vào tổng điểm
        });

        // Làm tròn tổng điểm cuối cùng (thang 10)
        const finalScoreRounded = totalScore.toFixed(2);

        // Cập nhật hiển thị điểm
        scoreContainer.innerHTML = `Kết quả: <strong style="font-size: 1.1em;">Điểm: ${finalScoreRounded} / 10</strong>`;
        scoreContainer.style.display = 'block';
        filterContainer.style.display = 'block'; // Hiện bộ lọc
        resultContainer.style.display = 'block';

        // Cập nhật trạng thái nút
        submitButton.style.display = 'none';
        retryButton.style.display = 'inline-block';

        // Áp dụng bộ lọc mặc định (Tất cả)
        applyFilter('all');
        // Đặt lại trạng thái active cho nút lọc 'Tất cả'
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') {
                btn.classList.add('active');
            }
        });


        if (!isAutoSubmit) {
             resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // --- Hàm áp dụng bộ lọc kết quả ---
    function applyFilter(filterType) {
        const resultItems = resultContainer.querySelectorAll('p[data-correctness], div[data-correctness]');
        resultItems.forEach(item => {
            const correctness = item.dataset.correctness;
             item.classList.remove('hidden-result'); // Xóa class ẩn trước khi kiểm tra

            if (filterType === 'all') {
                // item.style.display = 'block'; // Hiện tất cả
                 // Không cần làm gì thêm vì đã xóa class hidden
            } else if (filterType === 'correct') {
                if (correctness !== 'correct') {
                    // item.style.display = 'none'; // Ẩn nếu không đúng
                    item.classList.add('hidden-result');
                } else {
                    // item.style.display = 'block';
                }
            } else if (filterType === 'incorrect') {
                if (correctness === 'correct') {
                    // item.style.display = 'none'; // Ẩn nếu đúng
                     item.classList.add('hidden-result');
                } else {
                    // item.style.display = 'block'; // Hiện nếu sai hoặc chưa trả lời
                }
            }
        });
    }


    // --- Hàm xử lý khi nhấn nút Làm lại ---
    function retryQuiz() {
        if (timerIntervalId) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
        quizSection.style.display = 'none';
        resultContainer.style.display = 'none';
        scoreContainer.style.display = 'none';
        filterContainer.style.display = 'none'; // Ẩn bộ lọc
        infoScreen.style.display = 'block';
        updateInfoScreen();
        updateTimerDisplay(); // Reset màu timer nếu cần
    }

    // --- Hàm xử lý khi nhấn nút Bắt đầu ---
    function handleStartQuiz() {
        infoScreen.style.display = 'none';
        quizSection.style.display = 'block';
        displayQuestions();
        startTimer();
    }

    // --- Gắn sự kiện ---
    startBtn.addEventListener('click', handleStartQuiz);
    submitButton.addEventListener('click', () => calculateScore(false));
    retryButton.addEventListener('click', retryQuiz);

    // Gắn sự kiện cho các nút lọc (sử dụng event delegation)
    filterContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            const filterType = event.target.dataset.filter;
            // Bỏ active class khỏi tất cả nút
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            // Thêm active class cho nút được nhấn
            event.target.classList.add('active');
            // Áp dụng bộ lọc
            applyFilter(filterType);
        }
    });


    // --- Khởi tạo ban đầu ---
    updateInfoScreen();
});
