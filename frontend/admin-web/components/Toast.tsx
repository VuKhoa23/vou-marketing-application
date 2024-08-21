export type ToastProps = {
    type: string;
    title?: string;
    body: string;
    icon?: SVGElement;
};

export default function ToastProps({ type, body }: ToastProps) {
    return type === "success" ? (
        <div className="alert alert-success">
            <span>{body}</span>
        </div>
    ) : (
        <div className="alert alert-error">
            <span>{body}</span>
        </div>
    );
}
