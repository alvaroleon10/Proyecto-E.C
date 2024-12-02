const API_URL = "http://localhost:3000";

// Elementos del DOM
const formPost = document.getElementById('postForm');
const titleInput = document.getElementById('postTitle');
const authorInput = document.getElementById('postAuthor');
const contentInput = document.getElementById('postContent');

// Función para cargar usuarios y rellenar el select
async function loadUsers() {
  try {
    const usersResponse = await fetch(`${API_URL}/users`);
    const users = await usersResponse.json();

    // Rellenar el select con los usuarios
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id; // El value es el ID del usuario
      option.textContent = user.name; // El texto visible es el nombre
      authorInput.appendChild(option);
    });

    console.log("Usuarios cargados en el select.");
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
  }
}

// Evento para manejar la creación de un nuevo post
formPost.addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = titleInput.value.trim();
  const autor = parseInt(authorInput.value); // El ID del autor seleccionado
  const contenido = contentInput.value.trim();

  if (!titulo || !autor || !contenido) {
    alert("Por favor, rellena todos los campos");
    return;
  }

  try {
    const articlesResponse = await fetch(`${API_URL}/articles`);
    const articles = await articlesResponse.json();

    // Calcular el próximo ID
    const newId = articles.length > 0 ? Math.max(...articles.map(article => article.id)) + 1 : 1;

    // Crear el nuevo post
    const response = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: newId,
        title: titulo,
        content: contenido,
        authorId: autor,
      }),
    });

    if (response.ok) {
      alert("Post creado con éxito.");
      formPost.reset(); // Limpiar el formulario
    } else {
      throw new Error("No se pudo crear el post. Por favor, inténtalo de nuevo.");
    }
  } catch (error) {
    console.error("Error al crear el post:", error);
    alert("Hubo un error al crear el post.");
  }
});

// Cargar los usuarios al cargar la página
loadUsers();

