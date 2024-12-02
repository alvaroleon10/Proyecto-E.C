const API_URL = "http://localhost:3000";

// Elementos del DOM
const postTitle = document.getElementById("postTitle");
const postAuthor = document.getElementById("postAuthor");
const postContent = document.getElementById("postContent");
const commentsList = document.getElementById("commentsList");
const commentForm = document.getElementById("commentForm");
const commentAuthor = document.getElementById("commentAuthor");
const commentContent = document.getElementById("commentContent");

// Obtener el ID del artículo desde la URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = Number(urlParams.get("articleId"));

// Función para cargar los detalles del artículo
async function fetchPostDetails() {
  try {
    const [articleRes, commentsRes, usersRes] = await Promise.all([
      fetch(`${API_URL}/articles/${articleId}`),
      fetch(`${API_URL}/comments?articleId=${articleId}`),
      fetch(`${API_URL}/users`)
    ]);

    if (!articleRes.ok) {
      postTitle.textContent = "Artículo no encontrado.";
      postContent.textContent = "No se pudo cargar el artículo.";
      return;
    }

    const article = await articleRes.json();
    const comments = await commentsRes.json();
    const users = await usersRes.json();

    displayPostDetails(article, users);
    displayComments(comments, users);
    populateCommentAuthors(users);
  } catch (error) {
    console.error("Error al cargar los detalles:", error);
    postTitle.textContent = "Error al cargar el artículo.";
    postContent.textContent = "Intenta recargar la página.";
  }
}

// Mostrar los detalles del artículo en el DOM
function displayPostDetails(article, users) {
  const author = users.find(user => Number(user.id) === article.authorId);
  postTitle.textContent = article.title || "Título no disponible";
  postAuthor.textContent = `Autor/a: ${author ? author.name : "Desconocido"}`;
  postContent.textContent = article.content || "Contenido no disponible";
}

// Mostrar los comentarios del artículo
function displayComments(comments, users) {
  commentsList.innerHTML = ""; // Limpiar la lista de comentarios

  comments.forEach(comment => {
    const author = users.find(user => Number(user.id) === comment.userId);
    const commentItem = document.createElement("li");
    commentItem.innerHTML = `
      <p>${comment.comment}</p>
      <p><strong>Autor/a:</strong> ${author ? author.name : "Desconocido"}</p>
    `;
    commentsList.appendChild(commentItem);
  });
}

// Rellenar el select de autores en el formulario de comentarios
function populateCommentAuthors(users) {
  commentAuthor.innerHTML = ""; // Limpiar el select

  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    commentAuthor.appendChild(option);
  });

  console.log("Autores cargados en el select de comentarios.");
}

// Manejar el envío de un nuevo comentario
commentForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userId = parseInt(commentAuthor.value);
  const comment = commentContent.value.trim();

  if (!comment) {
    alert("Por favor, escribe un comentario.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comment,
        userId,
        articleId
      }),
    });

    if (response.ok) {
      commentContent.value = ""; // Limpiar el campo de comentario
      fetchPostDetails(); // Recargar los detalles para incluir el nuevo comentario
    } else {
      throw new Error("No se pudo añadir el comentario.");
    }
  } catch (error) {
    console.error("Error al añadir el comentario:", error);
    alert("Hubo un error al añadir el comentario.");
  }
});

// Cargar los detalles al abrir la página
fetchPostDetails();



