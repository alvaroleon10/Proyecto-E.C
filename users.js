// URL base de la API
const API_URL = "http://localhost:3000";

// Elementos del formulario
const userForm = document.getElementById("userForm");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

// Manejar el envío del formulario
userForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evitar el envío predeterminado

  // Capturar los valores del formulario
  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validar que los campos no estén vacíos
  if (!username || !email || !password) {
    alert("Por favor, rellena todos los campos.");
    return;
  }

  //asi obtengo los usuarios actuales
  const usersResponse = await fetch(`${API_URL}/users`);
  const users = await usersResponse.json();

  // Calcular el próximo ID
  const newId = users.length + 1;

  // Crear el nuevo usuario
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: newId,
        name: username,
        email: email,
        // No necesitamos almacenar la contraseña en el JSON server en este caso
      }),
    });

    if (response.ok) {
      alert("Usuario creado con éxito.");
      userForm.reset(); // Limpiar el formulario
    } else {
      throw new Error("No se pudo crear el usuario. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    alert("Hubo un error al crear el usuario.");
  }
});
