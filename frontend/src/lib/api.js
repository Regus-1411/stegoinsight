const API_BASE = "/api";

export async function analyzeFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/analyze/`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
            const errData = await response.json();
            errorMessage = errData.detail || errorMessage;
        } catch {
            // keep default
        }
        throw new Error(errorMessage);
    }

    return response.json();
}
