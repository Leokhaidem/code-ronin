interface HandleSubmissionProps {
    message?: string;
    code?: string;
    statusId?: number;
}

export default function handleSubmissionForAll({ message, code, statusId }: HandleSubmissionProps) {
    console.log(message);
    console.log(code);
    console.log(statusId);
}
