<?php
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos SQLite
$db_file = __DIR__ . '/users.db';
try {
    $db = new PDO("sqlite:" . $db_file);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Crear tablas si no existen
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    
    $db->exec("CREATE TABLE IF NOT EXISTS beta_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        platform TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Error al conectar con la base de datos: ' . $e->getMessage()
    ]);
    exit;
}

// Obtener datos de la petición (JSON o POST estándar)
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    $input = $_POST;
}

$action = isset($input['action']) ? trim($input['action']) : '';

if ($action === 'register') {
    // Registro de usuario en el modal
    $username = isset($input['username']) ? trim($input['username']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';
    
    if (strlen($username) < 4) {
        echo json_encode(['status' => 'error', 'message' => 'El nombre de usuario debe tener al menos 4 caracteres.']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'El correo electrónico no es válido.']);
        exit;
    }
    
    if (strlen($password) < 6) {
        echo json_encode(['status' => 'error', 'message' => 'La contraseña debe tener al menos 6 caracteres.']);
        exit;
    }
    
    // Validar si el usuario o email ya existe
    try {
        $stmt = $db->prepare("SELECT id FROM users WHERE username = :username OR email = :email");
        $stmt->execute([':username' => $username, ':email' => $email]);
        if ($stmt->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'El usuario o el correo electrónico ya están registrados.']);
            exit;
        }
        
        // Hashing password
        $password_hash = password_hash($password, PASSWORD_BCRYPT);
        
        // Insertar en base de datos
        $stmt = $db->prepare("INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password_hash)");
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':password_hash' => $password_hash
        ]);
        
        echo json_encode([
            'status' => 'success',
            'message' => '¡Cuenta creada con éxito! Bienvenido a bordo.'
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error al registrar: ' . $e->getMessage()]);
    }
    exit;
} elseif ($action === 'beta') {
    // Registro para la beta
    $name = isset($input['name']) ? trim($input['name']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $platform = isset($input['platform']) ? trim($input['platform']) : '';
    
    if (empty($name)) {
        echo json_encode(['status' => 'error', 'message' => 'El nombre es obligatorio.']);
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'El correo electrónico no es válido.']);
        exit;
    }
    
    if (empty($platform)) {
        echo json_encode(['status' => 'error', 'message' => 'Debes seleccionar una plataforma.']);
        exit;
    }
    
    try {
        // Validar si ya está registrado
        $stmt = $db->prepare("SELECT id FROM beta_signups WHERE email = :email");
        $stmt->execute([':email' => $email]);
        if ($stmt->fetch()) {
            echo json_encode(['status' => 'error', 'message' => 'Este correo electrónico ya está registrado para la beta.']);
            exit;
        }
        
        // Insertar
        $stmt = $db->prepare("INSERT INTO beta_signups (name, email, platform) VALUES (:name, :email, :platform)");
        $stmt->execute([
            ':name' => $name,
            ':email' => $email,
            ':platform' => $platform
        ]);
        
        echo json_encode([
            'status' => 'success',
            'message' => '¡Pre-registro exitoso! Te hemos añadido a la lista de espera para la beta.'
        ]);
    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Error al guardar pre-registro: ' . $e->getMessage()]);
    }
    exit;
} else {
    echo json_encode(['status' => 'error', 'message' => 'Acción no válida.']);
    exit;
}
