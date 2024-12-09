
const video_element = document.querySelector('#video')
const quiz_element = document.querySelector('#p2 .quiz')
const choice_element = document.querySelector('#p2 .choice')
const points_element = document.querySelector('#points')

const video_path_template = 'assets/video/?.mp4'
const waiting_time = 500

var ambient = undefined;

const action_list = {
    '1': {
        type: 'choice',
        answers: [
            ['Risposta 2', '2'],
            ['Risposta 3', '3']
        ]
    },
    '2': {
        type: 'quiz',
        question: 'Di che colore era il cavallo bianco di Napoleone?',
        answers: [
            ['Sbagliata', false],
            ['Corretta', true]
        ],
        next: '1'
    },
    '3': {
        type: 'next',
        next: '4'
    },
    '4': {
        type: 'next',
        next: -1
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

    ans_btn_1.innerText = ans1
    ans_btn_2.innerText = ans2

    ans_btn_1.onclick = () => {

        // CORRECT
        if(ans_btn_1.innerText == correct_text) {

            // ! start correct SFX

            points_element.innerText = parseInt(points_element.innerText) + 1

        } else {
            
            // WRONG
            
            // ! start wrong SFX
            
            points_element.innerText = parseInt(points_element.innerText) - 1
        
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

            // ! start correct SFX

            points_element.innerText = parseInt(points_element.innerText) + 1

        } else {
            
            // WRONG
            
            // ! start wrong SFX
            
            points_element.innerText = parseInt(points_element.innerText) - 1
        
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

        choice_element.innerHTML += `<button class="special" onclick="play_audio('click', .5); set_page(${answer[1]})">${answer[0]}</button>`

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
        document.querySelector('#p3 p.points').innerText = 'Punti: ' + points_element.innerText
        document.querySelector('#p3').classList.remove('hide')

        return

    }

    quiz_element.classList.add('hide')
    choice_element.classList.add('hide')

    video_element.src = video_path_template.replace('?', code)
    video_element.currentTime = 0

    const action = action_list[code]

    if(action.type == 'choice') {
        
        ambient = play_ambient('test', .8)

        set_choice(action.answers)

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
