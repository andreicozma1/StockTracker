
import { TextField, makeStyles, Grid, Paper, Button } from "@material-ui/core"
import { useState } from "react"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(2),
        padding: theme.spacing(1),
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 300,
        },
    },
    submit: {
        margin: theme.spacing(2),
        width: 100,
    }
}))



export default function Login() {

    const classes = useStyles();

    const [userId, setUserId] = useState("");
    const [userFirst, setUserFirst] = useState("");
    const [userLast, setUserLast] = useState("");
    const [userPin, setUserPin] = useState("");

    const [userIdErr, setUserIdErr] = useState("");
    const [userFirstErr, setUserFirstErr] = useState("");
    const [userLastErr, setUserLastErr] = useState("");
    const [userPinErr, setUserPinErr] = useState("");

    const [submitDisable, setSubmitDisable] = useState(true);

    const form_fields = {
        "User ID": {
            type: TextField,
            validation: {
                letters: true,
                numbers: true,
                spaces: false,
                min: 6,
                max: 20
            },
            props: {
                error: false,
                required: true,
                variant: "outlined",
                get: userId,
                set: setUserId,
                getError: userIdErr,
                setError: setUserIdErr,
            }

        },
        "First Name": {
            type: TextField,
            validation: {
                letters: true,
                numbers: false,
                spaces: false,
                min: 2,
                max: 16
            },
            props: {
                error: false,
                required: true,
                variant: "outlined",
                get: userFirst,
                set: setUserFirst,
                getError: userFirstErr,
                setError: setUserFirstErr,
            }

        },
        "Last Name": {
            type: TextField,
            validation: {
                letters: true,
                numbers: false,
                spaces: false,
                min: 2,
                max: 16
            },
            props: {
                error: false,
                required: true,
                variant: "outlined",
                get: userLast,
                set: setUserLast,
                getError: userLastErr,
                setError: setUserLastErr,
            }
        },
        "Access PIN": {
            type: TextField,
            validation: {
                letters: false,
                numbers: true,
                spaces: false,
                min: 4,
                max: 12
            },
            props: {
                error: false,
                required: true,
                variant: "outlined",
                get: userPin,
                set: setUserPin,
                getError: userPinErr,
                setError: setUserPinErr,
            }
        }
    }

    const validate = (e) => {
        const id = e.target.id;
        const text = e.target.value
        const input = form_fields[id];

        var regExpLetters = /[a-zA-Z]/g;
        var regExpNumbers = /\d/g;

        var errors = [];
        var errortxt = "";

        if (text.length < input.validation.min || text.length > input.validation.max)
            errortxt = "Length must be between " + input.validation.min + " and " + input.validation.max + ".\n";
        if (!input.validation.letters && regExpLetters.test(text))
            errors.push("Letters");
        if (!input.validation.numbers && regExpNumbers.test(text))
            errors.push("Numbers");
        if (text.split(" ").length > 1)
            errors.push("Spaces");

        if (errors.length > 0) {
            errortxt = errortxt.concat(errors[0]);
            var delimiter = errors.length === 2 ? " and " : ", ";

            for (var i = 1; i < errors.length; i++) {
                if (errors.length > 2 && i === errors.length - 1)
                    delimiter = ", and "

                errortxt = errortxt.concat(delimiter).concat(errors[i].toLowerCase());
            }
            errortxt = errortxt.concat(" not allowed.");
        }
        input.props.setError(errortxt);

        if (errortxt === "") {
            var disableSubmit = false;
            for (var element_id in form_fields) {
                if (element_id !== id && (form_fields[element_id].props.getError !== "" || form_fields[element_id].props.get.length <= 1))
                    disableSubmit = true;
            }
            setSubmitDisable(disableSubmit);
        } else {
            setSubmitDisable(true);
        }

        input.props.set(text)
    }

    const handleSubmit = (e) => {

    }

    return (
        <Paper className={classes.root}>
            <form noValidate autoComplete="off">
                <Grid container direction="column" alignItems="center">
                    {
                        Object.keys(form_fields).map(function (id) {
                            const input = form_fields[id];
                            const FieldType = input.type;
                            const properties = input.props;

                            return <FieldType key={id} id={id} label={id} error={properties.getError ? true : false} helperText={properties.getError} required={properties.required} variant={properties.variant} value={properties.get} onChange={validate} />
                        })
                    }
                    <Button className={classes.submit} disabled={submitDisable} onClick={handleSubmit} variant="contained" color="secondary" size="medium">Login</Button>
                </Grid>
            </form>
        </Paper>

    );
}
