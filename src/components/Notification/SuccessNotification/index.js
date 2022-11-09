import clsx from 'clsx';
import styles from './SuccessNotification.module.css';

function SuccessNotification() {
    return ( 
        <div id='success-notification' className={clsx("flex", styles.wrapper)}>
            <div className="m-auto w-full">
                <div className="bg-white rounded-lg border p-3 shadow-lg">
                    <div className="flex flex-row">
                        <div className="px-2">
                            <svg width="24" height="24" viewBox="0 0 1792 1792" fill="#44C997" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/>
                            </svg>
                        </div>
                        <div className="ml-2 mr-6">
                            <span className="font-semibold">Thành công!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function successNotification() {
    const parentNode = document.querySelector('.App');

    parentNode.innerHTML += `<div id="success-notification" class="flex ${styles.wrapper}"><div class="m-auto w-full"><div class="bg-white rounded-lg border p-3 shadow-lg"><div class="flex flex-row"><div class="px-2"><svg width="24" height="24" viewBox="0 0 1792 1792" fill="#44C997" xmlns="http://www.w3.org/2000/svg"><path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"/></svg></div><div class="ml-2 mr-6"><span class="font-semibold">Thành công</span></div></div></div></div></div>`;

    setTimeout(() => {
        parentNode.removeChild(parentNode.lastChild);
    }, 5000);
}

export { successNotification };

export default SuccessNotification;