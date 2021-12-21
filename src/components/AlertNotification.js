import {useSelector} from "react-redux";
import {useEffect} from "react";
import {useSnackbar} from "notistack";

const AlertNotification = () => {
    const {error, success} = useSelector((state) => state['alert']);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (error && error.message) {
            enqueueSnackbar(error.message, {variant: "error"});
        }
    }, [error]);

    useEffect(() => {
        if (success && success.message) {
            enqueueSnackbar(success.message, {variant: "success"});
        }
    }, [success]);

    return null;
};

export default AlertNotification;
