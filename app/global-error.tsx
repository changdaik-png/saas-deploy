"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    fontFamily: "sans-serif",
                    padding: "2rem",
                    textAlign: "center",
                }}>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                        문제가 발생했습니다
                    </h2>
                    <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                        {error.message || "알 수 없는 오류가 발생했습니다."}
                    </p>
                    <button
                        onClick={reset}
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        다시 시도
                    </button>
                </div>
            </body>
        </html>
    );
}
