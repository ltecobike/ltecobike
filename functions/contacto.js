export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.formData();

    const nombre = data.get("nombre") || "";
    const apellido = data.get("apellido") || "";
    const celular = data.get("celular") || "";
    const email = data.get("email") || "";
    const mensaje = data.get("message") || "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (nombre.trim().length < 2) {
        return new Response("El nombre debe tener al menos 2 caracteres.", { status: 400 });
      }

      if (!emailRegex.test(email.trim())) {
        return new Response("El correo electrónico no es válido.", { status: 400 });
      }

      if (mensaje.trim().length < 10) {
        return new Response("El mensaje debe tener al menos 10 caracteres.", { status: 400 });
      }

      if (mensaje.trim().length > 1000) {
        return new Response("El mensaje no puede superar los 1000 caracteres.", { status: 400 });
      }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Ltecobike <contacto@ltecobike.shop>",
        to: ["ltecobike@gmail.com"],
        subject: "Nueva consulta desde Ltecobike",
        html: `
          <h2>Nueva consulta desde la web</h2>
          <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
          <p><strong>Celular:</strong> ${celular}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${mensaje}</p>
        `
      })
    });

    if (!response.ok) {
      return new Response("Error enviando mail", { status: 500 });
    }

    return new Response("OK", { status: 200 });

  } catch (error) {
    return new Response("Error interno", { status: 500 });
  }
}