import { useEffect } from "react";

function TransactionHistory({ handleSetPage }) {

    useEffect(() => {
        handleSetPage('Lịch sử giao dịch');
    }, [])

    return ( 
        <h1>lich su giao dich</h1>
    );
}

export default TransactionHistory;