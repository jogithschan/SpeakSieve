import React from "react";
import ReactAudioPlayer from 'react-audio-player';
import mp3_file from './sample.mp3';
import './ConfirmedPage.css'



//...

const ConfirmedPage = () => {
    return (

    <div class = "page">
        <h2><u>Audio Submitted Successfully</u> </h2>
    
    <br></br>

    <h4>Audio 1</h4>
    <div class = "audio">
    <ReactAudioPlayer src= {mp3_file} controls/>
    </div>
    <br></br>

    <h4>Audio 2</h4>

    <div class = "audio">
    <ReactAudioPlayer src= {mp3_file} controls/>
    </div>

    <br></br>

    <h4>Audio 3</h4>

    <div class = "audio">
    <ReactAudioPlayer src= {mp3_file} controls/>
    </div>
    <br></br>

    <h4>Audio 4</h4>

    <div class = "audio">
    <ReactAudioPlayer src= {mp3_file} controls/>
    </div>
    

    <br></br>
    <h4>Audio Content:</h4>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Veniam magni minus vel eius nostrum. Dicta dolorum odio magnam eos iusto, sunt recusandae quia soluta impedit, ex, saepe nisi nesciunt! Reiciendis!
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro fugiat corporis sunt amet deserunt rem reprehenderit molestiae vel minima, voluptate molestias expedita excepturi eligendi reiciendis enim officia tenetur consequuntur non.
    </p>
</div>

    

    )
}

export default ConfirmedPage