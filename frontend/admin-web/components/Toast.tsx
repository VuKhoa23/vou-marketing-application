export type ToastProps = {
    type: string;
    title?: string;
    body: string;
    icon?: SVGElement;
};

export default function Toast({ type, title, body, icon }: ToastProps) {
    return type === "success" ? (
        <div className="alert alert-success">
            {title ? <h3>{title}</h3> : <></>}
            <p>{body}</p>
        </div>
    ) : (
        <div className="alert alert-error">
            {title ? <h3>{title}</h3> : <></>}
            <span>{body}</span>
        </div>
    );
}
