
const video_element = document.querySelector('#video')
const quiz_element = document.querySelector('#p2 .quiz')
const choice_element = document.querySelector('#p2 .choice')
const life_element = document.querySelector('#life')

const video_path_template = 'assets/video/?.mp4'
const waiting_time = 1000

var ambient = undefined;

const action_list = {
    '1': {
        type: 'quiz',
        question: 'Quanti torrioni sono presenti a Sarzana?',
        answers: [
            ['3', false],
            ['4', true]
        ],
        next: '2'
    },
    '2': {
        type: 'next',
        next: '3'
    },
    '3': {
        type: 'choice',
        answers: [
            ['Comune', '4'],
            ['Palazzo Podestà', '5'],
            ['Fontana', '6'],
            ['Continua...', '7'],
        ]
    },
    '4': {
        type: 'quiz',
        question: 'In che anno Dante Alighieri passò da Sarzana?',
        answers: [
            ['1306', true],
            ['1409', false]
        ],
        next: '3'
    },
    '5': {
        type: 'quiz',
        question: 'A chi apparteneva Palazzo Podestà?',
        answers: [
            ['Ad un governatore', true],
            ['Ad un nobile', false]
        ],
        next: '3'
    },
    '6': {
        type: 'quiz',
        question: 'A chi è dedicata la statua in Piazza Matteotti?',
        answers: [
            ['Ad un angelo', false],
            ['Ad un soldato', true]
        ],
        next: '3'
    },
    '7': {
        type: 'next',
        next: '7p2'
    },
    '7p2': {
        type: 'quiz',
        question: 'A quale secolo risale la chiesa di Sant\'Andrea?',
        answers: [
            ['XI secolo', true],
            ['XII secolo', false]
        ],
        next: '8'
    },
    '8': {
        type: 'next',
        next: '9'
    },
    '9': {
        type: 'choice',
        answers: [
            ['Trattato Sarzana', '10'],
            ['Santa Maria', '11'],
            ['Continua', '12']
        ]
    },
    '10': {
        type: 'quiz',
        question: 'Con quale potenza Milano firmò la tregua a Sarzana?',
        answers: [
            ['Genova', false],
            ['Firenze', true]
        ],
        next: '9'
    },
    '11': {
        type: 'quiz',
        question: 'Quale papa era nato a Sarzana?',
        answers: [
            ['Niccolò V', true],
            ['Pio II', false]
        ],
        next: '9'
    },
    '12': {
        type: 'next',
        next: '13'
    },
    '13': {
        type: 'choice',
        answers: [
            ['Cavalcanti', '14'],
            ['Statua', '15'],
            ['Continua...', '16'],
        ]
    },
    '14': {
        type: 'quiz',
        question: 'In che città venne esiliato Cavalcanti?',
        answers: [
            ['Reggio Calabria', false],
            ['Sarzana', true]
        ],
        next: '13'
    },
    '15': {
        type: 'quiz',
        question: 'Come viene soprannominato Garibaldi?',
        answers: [
            ['Eroe dei Due Mondi', true],
            ['Eroe d\'Italia', false]
        ],
        next: '13'
    },
    '16': {
        type: 'next',
        next: '17'
    },
    '17': {
        type: 'choice',
        answers: [
            ['Fortezza', '18'],
            ['Castracani', '19'],
            ['Via Francigena', '20'],
            ['Continua...', '21']
        ]
    },
    '18': {
        type: 'quiz',
        question: 'Da chi fu costruite la fortezza Firmafede?',
        answers: [
            ['Genovesi', true],
            ['Fiorentini', false]
        ],
        next: '17'
    },
    '19': {
        type: 'quiz',
        question: 'Cosa fu Castruccio Castracani?',
        answers: [
            ['Un comandante', true],
            ['Un nobile', false]
        ],
        next: '17'
    },
    '20': {
        type: 'quiz',
        question: 'Dove termina la Via Francigena?',
        answers: [
            ['Roma', true],
            ['Firenze', false]
        ],
        next: '17'
    },
    '21': {
        type: 'quiz',
        question: 'Quale stemma si trova su Porta Romana?',
        answers: [
            ['Romano', false],
            ['Genovese', true]
        ],
        next: '22'
    },
    '22': {
        type: 'next',
        next: -1
    }
}

function kill_life() {

    const life_count = life_element.innerText.length - 1

    life_element.innerText = ''

    for(let i=0; i<life_count; i++) {

        life_element.innerText += '♡'

    }

    if(life_count==0){

        try {
            ambient.pause()
        } catch {}
        
        video_element.pause()

        alert('Sei morto.\n\nProva a riiniziare la partita, evitando di sbagliare domande semplicissime!')

        play_ambient('bg', .2)

        document.querySelector('#p2').classList.add('hide')
        document.querySelector('#p3').classList.remove('hide')

    }

}

function play_audio(name, volume) {

    const audio = new Audio(`../assets/sfx/${name}.mp3`)
    
    audio.volume = volume
    audio.play()

}

function play_ambient(name, volume) {

    const audio = new Audio(`../assets/audio/${name}.mp3`)
    
    audio.volume = volume
    audio.play()

    return audio

}

function set_quiz(question, ans1, ans2, correct_text, end_code) {

    quiz_element.querySelector('p.text').innerText = question

    const ans_btn_1 = quiz_element.querySelector('.buttons').children[0]
    const ans_btn_2 = quiz_element.querySelector('.buttons').children[1]

    ans_btn_1.classList.remove('correct')
    ans_btn_1.classList.remove('wrong')
    ans_btn_2.classList.remove('correct')
    ans_btn_2.classList.remove('wrong')

    ans_btn_1.innerText = ans1
    ans_btn_2.innerText = ans2

    ambient = play_ambient('quest', .1)

    ans_btn_1.onclick = () => {

        // CORRECT
        if(ans_btn_1.innerText == correct_text) {

            play_audio('correct', .2)

            ans_btn_1.classList.add('correct')
            
        } else {
            
            // WRONG
            
            ans_btn_1.classList.add('wrong')
            
            kill_life()

        }

        ans_btn_1.onclick = () => {}
        ans_btn_2.onclick = () => {}

        setTimeout(()=>{

            set_page(end_code)
        
        }, waiting_time)
    }

    ans_btn_2.onclick = () => {

        // CORRECT
        if(ans_btn_2.innerText == correct_text) {

            play_audio('correct', .2)

            ans_btn_2.classList.add('correct')

        } else {
            
            // WRONG
            
            ans_btn_2.classList.add('wrong')
            
            kill_life()

        }

        ans_btn_1.onclick = () => {}
        ans_btn_2.onclick = () => {}

        setTimeout(()=>{

            set_page(end_code)
        
        }, waiting_time)
    }
            
    quiz_element.classList.remove('hide')

}

function set_choice(answers) {

    choice_element.innerHTML = ''

    for(const answer of answers) {

        choice_element.innerHTML += `<button class="special" onclick="play_audio('click', .2); set_page(${answer[1]})">${answer[0]}</button>`

    }

    choice_element.classList.remove('hide')

}

function set_page(code) {
    
    try {
        ambient.pause()
    } catch {}
    
    video_element.pause()
    
    if(code == -1) {

        document.querySelector('#p2').classList.add('hide')
        document.querySelector('#p3').classList.remove('hide')

        play_ambient('bg', .2)

        return

    }

    quiz_element.classList.add('hide')
    choice_element.classList.add('hide')

    video_element.src = video_path_template.replace('?', code)
    video_element.currentTime = 0

    const action = action_list[code]

    if(action.type == 'choice') {
        
        ambient = play_ambient('quest', .06)

        setTimeout(()=>{
            set_choice(action.answers)
        }, 4000)

    }

    video_element.onended = () => {

        if(action.type == 'next') {

            set_page(action.next)
    
        } else if (action.type == 'quiz') {
            
            const correct = action.answers[0][1] ? action.answers[0][0] : action.answers[1][0]
    
            set_quiz(action.question, action.answers[0][0], action.answers[1][0], correct, action.next)
    
        }

    }

}
