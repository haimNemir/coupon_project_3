import openAiImage from '../../assets/OpenAi-icon.svg';
import { useRef, useState } from "react";
import "./OpenAiChat.css";
import openAiService from "../../Services/OpenAiService";

export function OpenAiChat(): JSX.Element {

    const [showPopup, setShowPopup] = useState<boolean>(false)
    const [expandPopup, setExpandPopup] = useState<boolean>(false)

    type ChatEntry = { question: string; answer: string }; // -- type ChatEntry -- like interfase, using to defined a type of an object, over her is a "key,value -pair" of the previous question and answer.
    const promptRef = useRef<string>("") // useRef is a synchronized object, he will change in the same moment of the changing, but he will not make a render of the page. we use the value inside like this: promptRef.current
    const [promptState, setPromptState] = useState(''); // Current question of the user.
    const [responseState, setResponseState] = useState(''); // Current answer of the chat.
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]) // save a list of ChatEntry
    function sendMessage() {
        const currentPrompt = promptRef.current // we save the value in a teporary const (after the render the value will be initialized to empty) to prevent saving a wrong data inside the question in the chatHistory list, because the value can change between the sending and the saving because the sending is async and some others reasons, so its best practic to save it in a const.  
        promptRef.current = "" // initialized the current prompt to let the next question to be write.
        setPromptState("")

        openAiService.sendMessage(currentPrompt)
            .then(result => {
                setResponseState(result);
                setChatHistory(previousValues => [...previousValues, { question: currentPrompt, answer: result }]) // Here we take the new question/answer + all the previous objects in the list and create a new(!) useState with all those value because you cant add value to useState, you can only swith the value inside with another data. -- setChatHistory(previousValues => [...previousValues, ...}]) -- the sign of three dots (...pre) is called spreading objects, this mean he will take the all objects inside a list and spread them in the new list we are creating like this: {Object A, Object B, Object C, Object D}.
            })
            .catch(error => {
                const errorMessage =
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : error.response?.data?.message || "An error occurred";

                setChatHistory(previousValues => [...previousValues, { question: currentPrompt, answer: errorMessage }]);
            });
    }

    const closedClassName = "openAi_chat__div"
    const openClassName = "openAi_chat__div--onClick"
    const expandClassName = "openAi_chat__div--expand"

    return (
        <div className="OpenAiChat">
            <div className={showPopup && expandPopup ? expandClassName : showPopup && !expandPopup ? openClassName : closedClassName} onClick={() => { setShowPopup(true) }}>
                {!showPopup ? <img className='openAi_chat__div__svg--closed' src={openAiImage} alt="icon of open ai" /> : ""}
                {showPopup ?
                    <div className={'openAi_chat__popup'}>
                        <div className='openAi_chat__header'>
                            <img className="openAi_chat__div__svg--opened openAi_chat__grid_openAi_image" src={openAiImage} alt="icon of open ai" />
                            <p className='openAi_chat__div__title'>Ai assistant</p>

                            <div className='openAi_chat__controls_buttons'>
                                {!expandPopup ?
                                    <button title='Expand chat' className='openAi_chat__svg_button ' onClick={() => { setExpandPopup(!expandPopup) }} >
                                        <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4F1515" strokeWidth="0.72" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M4.75 9.233C4.75 9.64721 5.08579 9.983 5.5 9.983C5.91421 9.983 6.25 9.64721 6.25 9.233H4.75ZM6.25 5.5C6.25 5.08579 5.91421 4.75 5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5H6.25ZM5.5 4.75C5.08579 4.75 4.75 5.08579 4.75 5.5C4.75 5.91421 5.08579 6.25 5.5 6.25V4.75ZM9.233 6.25C9.64721 6.25 9.983 5.91421 9.983 5.5C9.983 5.08579 9.64721 4.75 9.233 4.75V6.25ZM6.03033 4.96967C5.73744 4.67678 5.26256 4.67678 4.96967 4.96967C4.67678 5.26256 4.67678 5.73744 4.96967 6.03033L6.03033 4.96967ZM9.96967 11.0303C10.2626 11.3232 10.7374 11.3232 11.0303 11.0303C11.3232 10.7374 11.3232 10.2626 11.0303 9.96967L9.96967 11.0303ZM15.767 18.75C15.3528 18.75 15.017 19.0858 15.017 19.5C15.017 19.9142 15.3528 20.25 15.767 20.25V18.75ZM19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5C20.25 19.0858 19.9142 18.75 19.5 18.75V20.25ZM18.75 19.5C18.75 19.9142 19.0858 20.25 19.5 20.25C19.9142 20.25 20.25 19.9142 20.25 19.5H18.75ZM20.25 15.767C20.25 15.3528 19.9142 15.017 19.5 15.017C19.0858 15.017 18.75 15.3528 18.75 15.767H20.25ZM18.9697 20.0303C19.2626 20.3232 19.7374 20.3232 20.0303 20.0303C20.3232 19.7374 20.3232 19.2626 20.0303 18.9697L18.9697 20.0303ZM15.0303 13.9697C14.7374 13.6768 14.2626 13.6768 13.9697 13.9697C13.6768 14.2626 13.6768 14.7374 13.9697 15.0303L15.0303 13.9697ZM6.25 15.767C6.25 15.3528 5.91421 15.017 5.5 15.017C5.08579 15.017 4.75 15.3528 4.75 15.767H6.25ZM4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25C5.91421 20.25 6.25 19.9142 6.25 19.5H4.75ZM5.5 18.75C5.08579 18.75 4.75 19.0858 4.75 19.5C4.75 19.9142 5.08579 20.25 5.5 20.25V18.75ZM9.233 20.25C9.64721 20.25 9.983 19.9142 9.983 19.5C9.983 19.0858 9.64721 18.75 9.233 18.75V20.25ZM4.96967 18.9697C4.67678 19.2626 4.67678 19.7374 4.96967 20.0303C5.26256 20.3232 5.73744 20.3232 6.03033 20.0303L4.96967 18.9697ZM11.0303 15.0303C11.3232 14.7374 11.3232 14.2626 11.0303 13.9697C10.7374 13.6768 10.2626 13.6768 9.96967 13.9697L11.0303 15.0303ZM15.767 4.75C15.3528 4.75 15.017 5.08579 15.017 5.5C15.017 5.91421 15.3528 6.25 15.767 6.25V4.75ZM19.5 6.25C19.9142 6.25 20.25 5.91421 20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75V6.25ZM20.25 5.5C20.25 5.08579 19.9142 4.75 19.5 4.75C19.0858 4.75 18.75 5.08579 18.75 5.5H20.25ZM18.75 9.233C18.75 9.64721 19.0858 9.983 19.5 9.983C19.9142 9.983 20.25 9.64721 20.25 9.233H18.75ZM20.0303 6.03033C20.3232 5.73744 20.3232 5.26256 20.0303 4.96967C19.7374 4.67678 19.2626 4.67678 18.9697 4.96967L20.0303 6.03033ZM13.9697 9.96967C13.6768 10.2626 13.6768 10.7374 13.9697 11.0303C14.2626 11.3232 14.7374 11.3232 15.0303 11.0303L13.9697 9.96967ZM6.25 9.233V5.5H4.75V9.233H6.25ZM5.5 6.25H9.233V4.75H5.5V6.25ZM4.96967 6.03033L9.96967 11.0303L11.0303 9.96967L6.03033 4.96967L4.96967 6.03033ZM15.767 20.25H19.5V18.75H15.767V20.25ZM20.25 19.5V15.767H18.75V19.5H20.25ZM20.0303 18.9697L15.0303 13.9697L13.9697 15.0303L18.9697 20.0303L20.0303 18.9697ZM4.75 15.767V19.5H6.25V15.767H4.75ZM5.5 20.25H9.233V18.75H5.5V20.25ZM6.03033 20.0303L11.0303 15.0303L9.96967 13.9697L4.96967 18.9697L6.03033 20.0303ZM15.767 6.25H19.5V4.75H15.767V6.25ZM18.75 5.5V9.233H20.25V5.5H18.75ZM18.9697 4.96967L13.9697 9.96967L15.0303 11.0303L20.0303 6.03033L18.9697 4.96967Z" fill="#4F1515"></path></g></svg>
                                    </button>
                                    :
                                    <button title='Collapse chat' className='openAi_chat__svg_button ' onClick={() => { setExpandPopup(!expandPopup) }} >
                                        <svg fill="#4F1515" width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#4F1515" strokeWidth="0.576" transform="rotate(45)matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><g data-name="Layer 2"><g data-name="collapse"><rect width="30" height="30" transform="rotate(180 12 12)" opacity="0"></rect><path d="M19 9h-2.58l3.29-3.29a1 1 0 1 0-1.42-1.42L15 7.57V5a1 1 0 0 0-1-1 1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 0-2z"></path><path d="M10 13H5a1 1 0 0 0 0 2h2.57l-3.28 3.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0L9 16.42V19a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z"></path></g></g></g></svg>
                                    </button>
                                }

                                <button title='Close chat' className='openAi_chat__svg_button ' onClick={(event) => {
                                    setShowPopup(!showPopup);
                                    event.stopPropagation(); //Prevents the event from spreading to the father
                                }} >
                                    <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4F1515" strokeWidth="1.2"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.384"></g><g id="SVGRepo_iconCarrier"><path d="M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z" fill="#4F1515"></path></g></svg>
                                </button>
                            </div>
                        </div>
                        <div className='openAi_chat__body--opend openAi_chat__grid'>
                            <div className='openAi_chat__previous_questions_answers'>
                                {chatHistory.map((entery, index) => (
                                    <div key={index} className='openAi_chat__conversation'>
                                        <p className='openAi_chat__question'>{entery.question} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum odit, ea ratione minus veritatis vitae labore quibusdam quasi dicta neque accusantium qui aut? Est rem facilis suscipit accusantium, velit aspernatur accusamus minus maiores, dignissimos nemo fuga tempora consectetur dicta odit eius impedit sunt quae pariatur obcaecati consequuntur rerum, iure dolore.</p>
                                        <p className='openAi_chat__answer'>{entery.answer} Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quos, sapiente.</p>
                                    </div>
                                ))}
                            </div>
                            <textarea
                                className='openAi_chat__textarea openAi_chat__grid_textarea'
                                value={promptState}
                                onChange={(e) => {
                                    setPromptState(e.target.value);
                                    promptRef.current = e.target.value;
                                }
                                }
                                placeholder="Ask something..."
                            />
                            

                            {responseState && (
                                <div className='openAi_chat__grid_response'>
                                    {responseState}
                                </div>
                            )}
                            <button
                                disabled={promptRef.current.trim().length === 0} // check if the user enter any question, if not he will not allowed to send the message
                                className='openAi_chat__grid_send_button openAi_chat__svg_button'
                                onClick={() => {
                                    sendMessage();
                                }} >
                                <svg width="35px" height="35px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#4f1515"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="#4f1515" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                            </button>
                        </div>
                    </div>
                    : ""
                }
            </div>

        </div>
    );
}

//Fix: in hebrow test right to left. and font family. when we send a message, the button is disabled and have a rolling spiner.
