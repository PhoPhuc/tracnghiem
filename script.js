document.addEventListener('DOMContentLoaded', () => {
    // --- Tham chiếu DOM cho các màn hình và phần tử chính ---
    const appContainer = document.getElementById('app-container');
    const screens = {
        subjectSelection: document.getElementById('subject-selection-screen'),
        quizList: document.getElementById('quiz-list-screen'),
        info: document.getElementById('info-screen'),
        quiz: document.getElementById('quiz-section'),
    };
    const subjectListContainer = document.getElementById('subject-list');
    const quizListContainer = document.getElementById('quiz-list');
    const quizListTitle = document.getElementById('quiz-list-title').querySelector('span');
    const backToSubjectsBtn = document.getElementById('back-to-subjects-btn');
    const backToQuizListBtn = document.getElementById('back-to-quiz-list-btn');
    const backToListAfterResultBtn = document.getElementById('back-to-list-after-result-btn');

    // Tham chiếu DOM cho màn hình thông tin bài thi
    const infoQuizTitle = document.getElementById('quiz-title');
    const infoTotalQuestions = document.getElementById('info-total-questions');
    const infoTimeLimit = document.getElementById('info-time-limit');
    const startBtn = document.getElementById('start-btn');

    // Tham chiếu DOM cho màn hình làm bài thi
    const timerContainer = document.getElementById('timer-container');
    const timeLeftElement = document.getElementById('time-left');
    const quizContentContainer = document.getElementById('quiz'); // Nơi chứa câu hỏi
    const submitButton = document.getElementById('submit-btn');
    const retryButton = document.getElementById('retry-btn'); // Nút này giờ sẽ quay lại quiz list
    const scoreContainer = document.getElementById('score-container');
    const filterContainer = document.getElementById('filter-container'); // Bộ lọc
    const resultContainer = document.getElementById('result-container');

    // --- Trạng thái ứng dụng ---
    let currentView = 'subjectSelection'; // Màn hình hiện tại
    let selectedSubjectSlug = null;     // Môn học đang chọn (vd: 'vat-li')
    let selectedQuizData = null;        // Dữ liệu của bài thi đang chọn/làm
    let timerIntervalId = null;         // ID của interval timer (cho quiz)
    let remainingTime = 0;              // Thời gian còn lại (giây) (cho quiz)

    // --- Dữ liệu Quiz (Tổ chức theo môn học) ---
    // !!! QUAN TRỌNG: Đây chỉ là dữ liệu mẫu. Bạn cần thay thế bằng dữ liệu thật !!!
    const quizData = {
        'vat-li': {
            subjectName: 'Vật lí',
            icon: 'ph-atom', // Tên icon từ Phosphor Icons
            quizzes: [
                {
                    id: 'vl-1',
                    title: 'Đề 1: Dao Động Cơ',
                    timeLimitMinutes: 30,
                    questions: [
                        { type: 'mc', question: "Công thức tính chu kỳ dao động của con lắc lò xo?", options: ["T=2π√(m/k)", "T=2π√(k/m)", "T=2π√(l/g)", "T=1/f"], correctAnswer: 0 },
                        { type: 'tf', question: "Đánh giá về dao động điều hòa:", statements: [ { text: "Li độ biến thiên điều hòa theo thời gian.", correctAnswer: true }, { text: "Vận tốc luôn cùng pha với li độ.", correctAnswer: false }, { text: "Gia tốc luôn ngược pha với li độ.", correctAnswer: true }, { text: "Năng lượng được bảo toàn nếu bỏ qua ma sát.", correctAnswer: true } ] },
                        // Thêm câu hỏi khác cho đề VL-1
                    ]
                },
                {
                    id: 'vl-2',
                    title: 'Đề 2: Sóng Cơ',
                    timeLimitMinutes: 45,
                    questions: [
                         { type: 'mc', question: "Sóng ngang truyền được trong môi trường nào?", options: ["Chất rắn và bề mặt chất lỏng", "Chất khí", "Chân không", "Cả rắn, lỏng, khí"], correctAnswer: 0 },
                         // Thêm câu hỏi khác
                    ]
                }
            ]
        },
        'hoa-hoc': {
            subjectName: 'Hoá học',
            icon: 'ph-flask',
            quizzes: [
                {
                    id: 'hh-1',
                    title: 'Đề 1: Nguyên Tử',
                    timeLimitMinutes: 20,
                    questions: [
                        { type: 'mc', question: "Hạt nhân nguyên tử được cấu tạo bởi?", options: ["Proton và Electron", "Neutron và Electron", "Proton và Neutron", "Chỉ Proton"], correctAnswer: 2 },
                        // Thêm câu hỏi khác
                    ]
                }
            ]
        },
        'lich-su': {
            subjectName: 'Lịch sử',
            icon: 'ph-scroll',
            quizzes: [ /* Thêm các bài thi lịch sử */ ]
        },
        'sinh-hoc': {
            subjectName: 'Sinh học',
            icon: 'ph-dna',
            quizzes: [ /* Thêm các bài thi sinh học */ ]
        },
        'tin-hoc': {
            subjectName: 'Tin học',
            icon: 'ph-laptop',
            quizzes: [
                 {
                    id: 'th-1',
                    title: 'Đề 1: Cơ Bản Về Máy Tính',
                    timeLimitMinutes: 25,
                    questions: [
                        { type: 'mc', question: "CPU là viết tắt của?", options: ["Central Processing Unit", "Computer Processing Unit", "Central Program Unit", "Control Processing Unit"], correctAnswer: 0 },
                        { type: 'tf', question: "Đánh giá về phần cứng và phần mềm:", statements: [ { text: "RAM là bộ nhớ truy cập ngẫu nhiên.", correctAnswer: true }, { text: "Hệ điều hành là một phần cứng.", correctAnswer: false }, { text: "Màn hình là thiết bị nhập.", correctAnswer: false }, { text: "Chuột là thiết bị xuất.", correctAnswer: false } ] },
                    ]
                }
             ]
        }
        // Thêm các môn học khác nếu cần
    };

    // --- Logic chính của Quiz Platform ---

    // Hàm chuyển đổi màn hình
    function navigateTo(screenId) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        if (screens[screenId]) {
            screens[screenId].classList.add('active');
            currentView = screenId;
            window.scrollTo(0, 0); // Cuộn lên đầu trang
        } else {
            console.error("Screen ID not found:", screenId);
        }
    }

    // Hàm hiển thị danh sách môn học
    function displaySubjectSelection() {
        subjectListContainer.innerHTML = ''; // Xóa danh sách cũ
        for (const slug in quizData) {
            const subject = quizData[slug];
            const card = document.createElement('div');
            card.classList.add('subject-card');
            card.dataset.subject = slug; // Lưu slug
            card.innerHTML = `
                <i class="ph ${subject.icon || 'ph-book-open'}"></i>
                <h3>${subject.subjectName}</h3>
            `;
            card.addEventListener('click', () => {
                selectedSubjectSlug = slug;
                displayQuizList(slug); // Chuyển sang hiển thị danh sách bài thi
            });
            subjectListContainer.appendChild(card);
        }
        navigateTo('subjectSelection'); // Hiển thị màn hình chọn môn
    }

    // Hàm hiển thị danh sách bài thi của môn học
    function displayQuizList(subjectSlug) {
        const subject = quizData[subjectSlug];
        if (!subject) {
            console.error("Subject not found:", subjectSlug);
            navigateTo('subjectSelection');
            return;
        }

        quizListTitle.textContent = subject.subjectName;
        quizListContainer.innerHTML = ''; // Xóa danh sách cũ

        if (subject.quizzes && subject.quizzes.length > 0) {
            subject.quizzes.forEach(quiz => {
                const listItem = document.createElement('div');
                listItem.classList.add('quiz-list-item');
                listItem.dataset.quizId = quiz.id; // Lưu id bài thi
                listItem.innerHTML = `
                    <span>${quiz.title}</span>
                    <i class="ph ph-caret-right"></i>
                `;
                listItem.addEventListener('click', () => {
                    selectedQuizData = subject.quizzes.find(q => q.id === quiz.id);
                    if (selectedQuizData) {
                        displayQuizInfo(); // Chuyển sang màn hình thông tin bài thi
                    } else {
                        console.error("Quiz not found:", quiz.id);
                    }
                });
                quizListContainer.appendChild(listItem);
            });
        } else {
            quizListContainer.innerHTML = '<p>Chưa có bài thi nào cho môn học này.</p>';
        }
        navigateTo('quizList'); // Hiển thị màn hình danh sách bài thi
    }

    // Hàm hiển thị thông tin chi tiết bài thi
    function displayQuizInfo() {
        if (!selectedQuizData) {
            console.error("No quiz selected to display info.");
            navigateTo('quizList');
            return;
        }
        infoQuizTitle.textContent = selectedQuizData.title;
        const mainQuestionsCount = selectedQuizData.questions.length;
        infoTotalQuestions.textContent = mainQuestionsCount;
        infoTimeLimit.textContent = selectedQuizData.timeLimitMinutes;
        navigateTo('info'); // Hiển thị màn hình thông tin
    }

    // Hàm hiển thị câu hỏi (Chấp nhận mảng câu hỏi làm tham số)
    function displayQuizContent(questionsArray) {
        quizContentContainer.innerHTML = '';
        let questionCounter = 0;
        questionsArray.forEach((q, index) => {
             questionCounter++;
             const questionBlock = document.createElement('div');
             questionBlock.classList.add('question-block');
             const questionText = document.createElement('p');
             questionText.classList.add('question-text');
             questionText.textContent = `${questionCounter}. ${q.question}`;
             questionBlock.appendChild(questionText);

             // Logic tạo HTML cho câu hỏi MC và TF
              if (q.type === 'mc') {
                 const optionsDiv = document.createElement('div'); optionsDiv.classList.add('options');
                 q.options.forEach((option, optionIndex) => {
                     const label = document.createElement('label'); const radioInput = document.createElement('input'); radioInput.type = 'radio'; radioInput.name = `question-${index}`; radioInput.value = optionIndex; label.id = `q${index}_opt${optionIndex}`; label.appendChild(radioInput); label.appendChild(document.createTextNode(` ${option}`)); optionsDiv.appendChild(label);
                 }); questionBlock.appendChild(optionsDiv);
             } else if (q.type === 'tf') {
                 const statementsContainer = document.createElement('div'); statementsContainer.classList.add('statements-container');
                 q.statements.forEach((statement, subIndex) => {
                     const statementItem = document.createElement('div'); statementItem.classList.add('statement-item'); const statementText = document.createElement('span'); statementText.classList.add('statement-text'); statementText.textContent = statement.text; statementItem.appendChild(statementText); const tfOptionsDiv = document.createElement('div'); tfOptionsDiv.classList.add('tf-options');
                     const trueLabel = document.createElement('label'); trueLabel.classList.add('tf-label'); const trueInput = document.createElement('input'); trueInput.type = 'radio'; trueInput.name = `question-${index}-statement-${subIndex}`; trueInput.value = 'true'; trueLabel.id = `q${index}_s${subIndex}_true`; trueLabel.appendChild(trueInput); trueLabel.appendChild(document.createTextNode(' Đúng')); tfOptionsDiv.appendChild(trueLabel);
                     const falseLabel = document.createElement('label'); falseLabel.classList.add('tf-label'); const falseInput = document.createElement('input'); falseInput.type = 'radio'; falseInput.name = `question-${index}-statement-${subIndex}`; falseInput.value = 'false'; falseLabel.id = `q${index}_s${subIndex}_false`; falseLabel.appendChild(falseInput); falseLabel.appendChild(document.createTextNode(' Sai')); tfOptionsDiv.appendChild(falseLabel);
                     statementItem.appendChild(tfOptionsDiv); statementsContainer.appendChild(statementItem);
                 }); questionBlock.appendChild(statementsContainer);
             }
             quizContentContainer.appendChild(questionBlock);
        });
        // Reset các thành phần khác trong màn hình quiz
        resultContainer.style.display = 'none'; resultContainer.innerHTML = ''; scoreContainer.style.display = 'none'; filterContainer.style.display = 'none'; retryButton.style.display = 'none'; backToListAfterResultBtn.style.display = 'none'; submitButton.style.display = 'inline-block'; submitButton.disabled = false;
    }

    // Hàm bắt đầu bộ đếm thời gian cho bài thi
    function startTimer(durationMinutes) {
        if (timerIntervalId) clearInterval(timerIntervalId); // Xóa timer cũ nếu có
        remainingTime = durationMinutes * 60;
        updateTimerDisplay(); // Hiển thị thời gian ban đầu
        timerIntervalId = setInterval(() => {
            remainingTime--;
            updateTimerDisplay();
            if (remainingTime <= 0) handleTimeUp(); // Xử lý khi hết giờ
        }, 1000);
    }

    // Hàm cập nhật hiển thị thời gian cho bài thi
    function updateTimerDisplay() {
         if (remainingTime < 0) remainingTime = 0;
         const minutes = Math.floor(remainingTime / 60);
         const seconds = remainingTime % 60;
         timeLeftElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
         // Logic đổi màu timer khi gần hết giờ
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

    // Hàm xử lý khi hết giờ làm bài thi
    function handleTimeUp() {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        alert("Đã hết thời gian làm bài! Bài thi sẽ được nộp tự động.");
        calculateScore(true); // Tự động nộp bài
    }

    // Hàm tính điểm và hiển thị kết quả (Đã sửa cách tính điểm TF)
    function calculateScore(isAutoSubmit = false) {
        if (!selectedQuizData) return; // Thoát nếu không có dữ liệu

        if (timerIntervalId) { // Dừng timer nếu đang chạy
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }

        let totalScore = 0; // Điểm tổng (thang 10)
        resultContainer.innerHTML = ''; // Xóa kết quả cũ

        const currentQuestions = selectedQuizData.questions; // Lấy câu hỏi của bài thi hiện tại
        const totalMainQuestions = currentQuestions.length;
        const pointsPerMainQuestion = totalMainQuestions > 0 ? (10 / totalMainQuestions) : 0;
        let questionCounter = 0;

        currentQuestions.forEach((q, index) => {
            questionCounter++;
            let isQuestionCorrectForFilter = false; // Cờ cho bộ lọc
            let questionPoints = 0; // Điểm cho câu hỏi này

             if (q.type === 'mc') {
                 const resultP = document.createElement('p');
                 resultP.innerHTML = `<strong>Câu ${questionCounter} (Trắc nghiệm):</strong> ${q.question}<br>`;
                 const selectedOptionInput = quizContentContainer.querySelector(`input[name="question-${index}"]:checked`);
                 const allOptionsInputs = quizContentContainer.querySelectorAll(`input[name="question-${index}"]`);
                 const correctAnswerIndex = q.correctAnswer;
                 let userAnswerIndex = -1;

                 allOptionsInputs.forEach((input, optIndex) => {
                     input.disabled = true; // Vô hiệu hóa input
                     const label = input.closest('label');
                     if(label){
                         if (optIndex === correctAnswerIndex) label.classList.add('correct-option'); // Đánh dấu đáp án đúng
                         if (input.checked) {
                             userAnswerIndex = parseInt(input.value);
                             if (userAnswerIndex !== correctAnswerIndex) label.classList.add('incorrect-option'); // Đánh dấu đáp án sai người dùng chọn
                         }
                     }
                 });

                 // Tạo text kết quả và tính điểm
                 if (userAnswerIndex !== -1) {
                    const correctAnswerText = q.options[correctAnswerIndex];
                    const userAnswerText = q.options[userAnswerIndex];
                    resultP.innerHTML += `&nbsp;&nbsp;Bạn chọn: <span class="user-answer">${userAnswerText}</span>. `;
                    if (userAnswerIndex === correctAnswerIndex) {
                        questionPoints = pointsPerMainQuestion; // Được điểm tối đa
                        isQuestionCorrectForFilter = true;
                        resultP.innerHTML += `<span class="correct">Đúng!</span>`;
                    } else {
                        isQuestionCorrectForFilter = false;
                        resultP.innerHTML += `<span class="incorrect">Sai.</span> Đáp án đúng là: <span class="correct">${correctAnswerText}</span>`;
                    }
                 } else {
                    isQuestionCorrectForFilter = false;
                    const correctAnswerText = q.options[correctAnswerIndex];
                    resultP.innerHTML += `&nbsp;&nbsp;<span class="incorrect">Bạn chưa trả lời.</span> Đáp án đúng là: <span class="correct">${correctAnswerText}</span>`;
                 }
                 resultP.dataset.correctness = isQuestionCorrectForFilter ? 'correct' : 'incorrect'; // Gán data cho bộ lọc
                 resultContainer.appendChild(resultP);

             } else if (q.type === 'tf') {
                 const resultDiv = document.createElement('div');
                 resultDiv.innerHTML = `<strong>Câu ${questionCounter} (Đúng/Sai):</strong> ${q.question}<br>`;
                 let pointsForThisTF = 0; // Điểm tích lũy cho câu TF này
                 const pointsPerStatement = pointsPerMainQuestion * 0.25; // Điểm cho mỗi ý đúng
                 let correctStatementsCount = 0; // Đếm số ý đúng

                 q.statements.forEach((statement, subIndex) => {
                     const statementResultDiv = document.createElement('div');
                     statementResultDiv.classList.add('statement-result-item');
                     statementResultDiv.innerHTML = `&nbsp;&nbsp;- ${statement.text}: `;
                     const selectedTFInput = quizContentContainer.querySelector(`input[name="question-${index}-statement-${subIndex}"]:checked`);
                     const allTFInputs = quizContentContainer.querySelectorAll(`input[name="question-${index}-statement-${subIndex}"]`);
                     const correctAnswerBool = statement.correctAnswer;
                     const trueLabel = quizContentContainer.querySelector(`input[name="question-${index}-statement-${subIndex}"][value="true"]`)?.closest('label');
                     const falseLabel = quizContentContainer.querySelector(`input[name="question-${index}-statement-${subIndex}"][value="false"]`)?.closest('label');

                     allTFInputs.forEach(input => input.disabled = true);
                     // Đánh dấu đáp án đúng (cả True và False)
                     if (correctAnswerBool === true && trueLabel) trueLabel.classList.add('correct-option');
                     else if (correctAnswerBool === false && falseLabel) falseLabel.classList.add('correct-option');

                     let userAnswerBool = null;
                     if (selectedTFInput) {
                         userAnswerBool = (selectedTFInput.value === 'true');
                         const selectedLabel = selectedTFInput.closest('label');
                         statementResultDiv.innerHTML += `Bạn chọn <span class="user-answer">${userAnswerBool ? 'Đúng' : 'Sai'}</span>. `;
                         if (userAnswerBool === correctAnswerBool) {
                             pointsForThisTF += pointsPerStatement; // *** CỘNG DỒN ĐIỂM CHO MỖI Ý ĐÚNG ***
                             correctStatementsCount++;
                             statementResultDiv.innerHTML += `<span class="correct">Chính xác!</span>`;
                         } else {
                             if (selectedLabel) selectedLabel.classList.add('incorrect-option'); // Đánh dấu ý sai người dùng chọn
                             statementResultDiv.innerHTML += `<span class="incorrect">Không đúng.</span> Đáp án là: <span class="correct">${correctAnswerBool ? "Đúng" : "Sai"}</span>`;
                         }
                     } else {
                         statementResultDiv.innerHTML += `<span class="incorrect">Bạn chưa trả lời.</span> Đáp án là: <span class="correct">${correctAnswerBool ? "Đúng" : "Sai"}</span>`;
                     }
                     resultDiv.appendChild(statementResultDiv);
                 });
                 questionPoints = pointsForThisTF; // Gán điểm tổng cộng của các ý đúng
                 isQuestionCorrectForFilter = correctStatementsCount > 0; // Đánh dấu cho bộ lọc nếu đúng ít nhất 1 ý
                 resultDiv.dataset.correctness = isQuestionCorrectForFilter ? 'correct' : 'incorrect';
                 resultContainer.appendChild(resultDiv);
             }
             totalScore += questionPoints; // Cộng điểm câu hỏi vào tổng điểm
        });

        // Làm tròn tổng điểm cuối cùng và đảm bảo không vượt quá 10
        if (totalScore > 10) totalScore = 10;
        const finalScoreRounded = totalScore.toFixed(2);

        // Hiển thị điểm, bộ lọc, kết quả
        scoreContainer.innerHTML = `Kết quả: <strong style="font-size: 1.1em;">Điểm: ${finalScoreRounded} / 10</strong>`;
        scoreContainer.style.display = 'block';
        filterContainer.style.display = 'block';
        resultContainer.style.display = 'block';

        // Cập nhật trạng thái nút
        submitButton.style.display = 'none';
        retryButton.style.display = 'inline-block';
        backToListAfterResultBtn.style.display = 'inline-block';

        // Áp dụng bộ lọc mặc định và reset trạng thái nút lọc
        applyFilter('all');
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === 'all') btn.classList.add('active');
        });

        // Cuộn xuống kết quả nếu người dùng tự nộp
        if (!isAutoSubmit) {
             resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Hàm áp dụng bộ lọc kết quả
    function applyFilter(filterType) {
        const resultItems = resultContainer.querySelectorAll('p[data-correctness], div[data-correctness]');
        resultItems.forEach(item => {
            const correctness = item.dataset.correctness;
             item.classList.remove('hidden-result'); // Reset class ẩn
            if (filterType === 'all') { /* Hiện tất cả */ }
            else if (filterType === 'correct') { if (correctness !== 'correct') item.classList.add('hidden-result'); } // Ẩn nếu không đúng
            else if (filterType === 'incorrect') { if (correctness === 'correct') item.classList.add('hidden-result'); } // Ẩn nếu đúng
        });
    }

    // Hàm xử lý khi nhấn nút Làm lại (Quay về danh sách bài thi)
    function handleRetryQuiz() {
        if (timerIntervalId) { clearInterval(timerIntervalId); timerIntervalId = null; }
        if (selectedSubjectSlug) {
            displayQuizList(selectedSubjectSlug); // Quay về danh sách bài thi
        } else {
            displaySubjectSelection(); // Hoặc về màn hình chính nếu lỗi
        }
    }

    // Hàm xử lý khi nhấn nút Bắt đầu làm bài thi
    function handleStartQuiz() {
        if (!selectedQuizData) return; // Thoát nếu chưa chọn bài thi
        displayQuizContent(selectedQuizData.questions); // Hiển thị câu hỏi của bài thi đã chọn
        startTimer(selectedQuizData.timeLimitMinutes); // Bắt đầu timer với thời gian của bài thi
        navigateTo('quiz'); // Chuyển sang màn hình làm bài
    }

    // --- Gắn sự kiện ---
    startBtn.addEventListener('click', handleStartQuiz);
    submitButton.addEventListener('click', () => calculateScore(false)); // Nộp bài thủ công
    retryButton.addEventListener('click', handleRetryQuiz); // Nút Làm lại
    backToListAfterResultBtn.addEventListener('click', handleRetryQuiz); // Nút Quay lại danh sách sau kết quả

    // Nút quay lại giữa các màn hình
    backToSubjectsBtn.addEventListener('click', displaySubjectSelection);
    backToQuizListBtn.addEventListener('click', () => {
        if (selectedSubjectSlug) displayQuizList(selectedSubjectSlug);
        else displaySubjectSelection();
    });

    // Bộ lọc kết quả (sử dụng event delegation)
    filterContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('filter-btn')) {
            const filterType = event.target.dataset.filter;
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            applyFilter(filterType);
        }
    });


    // --- LOGIC COUNTDOWN ĐẾN NGÀY THI ---
    // --- THAY ĐỔI NGÀY GIỜ KẾT THÚC TẠI ĐÂY ---
    const countdownDate = new Date("May 12, 2025 08:00:00").getTime(); // Ngày thi dự kiến
    // --------------------------------------------
    const messageEl = document.getElementById('message');
    const countdownEl = document.getElementById('countdown');

    if (countdownEl && messageEl) { // Chỉ chạy nếu các element tồn tại
        let prevValues = { 'days-tens': -1, 'days-units': -1, 'hours-tens': -1, 'hours-units': -1, 'minutes-tens': -1, 'minutes-units': -1, 'seconds-tens': -1, 'seconds-units': -1 };

        // Hàm cập nhật một chữ số với hiệu ứng trượt
        function updateDigit(elementId, newDigit) {
            const prevDigit = prevValues[elementId];
            if (newDigit !== prevDigit) {
                const currentElement = document.getElementById(elementId);
                if (!currentElement) return;
                const container = currentElement.parentElement;
                if (!container) return;
                const oldDigitSpan = currentElement;
                const newDigitSpan = document.createElement('span');
                newDigitSpan.className = 'digit'; newDigitSpan.id = elementId; newDigitSpan.textContent = newDigit;
                // Cài đặt style cho animation
                newDigitSpan.style.position = 'absolute'; newDigitSpan.style.top = '0'; newDigitSpan.style.left = '0';
                newDigitSpan.style.width = '100%'; newDigitSpan.style.height = '100%';
                newDigitSpan.style.transform = 'translateY(-100%)'; newDigitSpan.style.transition = 'transform 0s';
                container.appendChild(newDigitSpan); oldDigitSpan.id = ''; // Xóa id của span cũ
                // Trigger animation
                requestAnimationFrame(() => {
                    newDigitSpan.style.transition = 'transform 0.4s ease-in-out';
                    requestAnimationFrame(() => { oldDigitSpan.style.transform = 'translateY(100%)'; newDigitSpan.style.transform = 'translateY(0)'; });
                });
                // Dọn dẹp span cũ sau khi animation kết thúc
                oldDigitSpan.addEventListener('transitionend', () => { if (oldDigitSpan.parentElement) { oldDigitSpan.remove(); } }, { once: true });
                // Reset style của span mới sau khi animation kết thúc
                newDigitSpan.addEventListener('transitionend', (event) => { if (event.target === newDigitSpan && newDigitSpan.parentElement && document.getElementById(elementId) === newDigitSpan) { newDigitSpan.style.position = ''; newDigitSpan.style.top = ''; newDigitSpan.style.left = ''; newDigitSpan.style.transform = ''; } }, { once: true });
                prevValues[elementId] = newDigit; // Lưu giá trị mới
            }
        }

        // Interval cập nhật đồng hồ mỗi giây
        const examCountdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;
            if (distance < 0) { // Khi hết thời gian
                clearInterval(examCountdownInterval);
                const allDigitIds = Object.keys(prevValues);
                allDigitIds.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '0'; });
                prevValues = allDigitIds.reduce((acc, id) => ({ ...acc, [id]: 0 }), {});
                if (countdownEl) countdownEl.style.display = 'none'; // Ẩn đồng hồ
                if (messageEl) messageEl.textContent = "Chúc bạn thi tốt!"; // Hiển thị thông báo
                return;
            }
            // Tính toán ngày, giờ, phút, giây
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Tách thành các chữ số
            const timeValues = { 'days-tens': Math.floor(days / 10), 'days-units': days % 10, 'hours-tens': Math.floor(hours / 10), 'hours-units': hours % 10, 'minutes-tens': Math.floor(minutes / 10), 'minutes-units': minutes % 10, 'seconds-tens': Math.floor(seconds / 10), 'seconds-units': seconds % 10 };
            // Cập nhật từng chữ số
            for (const id in timeValues) { updateDigit(id, timeValues[id]); }
        }, 1000);

        // Hàm khởi tạo hiển thị ban đầu cho đồng hồ đếm ngược ngày thi
        function initializeExamCountdownDisplay() {
            const now = new Date().getTime();
            const distance = countdownDate - now > 0 ? countdownDate - now : 0;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            const initialTimeValues = { 'days-tens': Math.floor(days / 10), 'days-units': days % 10, 'hours-tens': Math.floor(hours / 10), 'hours-units': hours % 10, 'minutes-tens': Math.floor(minutes / 10), 'minutes-units': minutes % 10, 'seconds-tens': Math.floor(seconds / 10), 'seconds-units': seconds % 10 };
            for (const id in initialTimeValues) {
                const element = document.getElementById(id);
                if (element) { element.textContent = initialTimeValues[id]; prevValues[id] = initialTimeValues[id]; }
            }
             if (distance <= 0 && messageEl) messageEl.textContent = "Chúc bạn thi tốt!"; // Hiển thị thông báo nếu đã qua ngày
        }
        initializeExamCountdownDisplay(); // Gọi hàm khởi tạo
    } else {
        console.warn("Countdown elements (#countdown, #message) not found. Exam countdown disabled.");
    }
    // --- KẾT THÚC LOGIC COUNTDOWN ĐẾN NGÀY THI ---


    // --- Khởi tạo ứng dụng ---
    displaySubjectSelection(); // Bắt đầu bằng màn hình chọn môn học

}); // Kết thúc DOMContentLoaded
