import clsx from 'clsx';
import styles from './ErrorNotification.module.css';

function ErrorNotification() {
    return ( 
        <div id='success-notification' className={clsx("flex", styles.wrapper)}>
            <div className="m-auto w-full">
                <div className="bg-white rounded-lg border p-3 shadow-lg">
                    <div className="flex flex-row">
                        <div className="text-red-500 border-2 border-red-500 rounded-full ml-2">
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z"/>
                                <path d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z"/>
                            </svg>
                        </div>
                        <div className="ml-3 mr-6">
                            <span className="font-semibold">Lỗi!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorNotification;