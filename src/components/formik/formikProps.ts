import styles from '../../styles/Form.module.css'

export interface Props {
    name: string;
    label?: string;
    type?: string;
    multiline?: boolean;
    rows?: number;
}

export const inputProps = {
    classes: {
        root: styles.input,
        error: styles['error-input']
    }
}

export const inputLabelProps = {
    classes: {
        root: styles['text-field'],
        error: styles['error-label']
    },
    style: {
        color: "#535040"
    }
}

export const formHelperTextProps = {
    classes: {
        root: styles['helper-text'],
        error: styles['helper-text-error']
    }
}