fetch('/api/users')
  .then(res => res.json())
  .then(users => {
    return users.map(user => 
      user.active ? <div>Ativo: {user.name}</div> : null
    );
  });

fetch('/api/product')
  .then(res => res.json())
  .then(users => {
    return users.map(user => 
      user.active ? <div>Ativo: {user.name}</div> : null
    );
  });

fetch('/api/comment')
  .then(res => res.json())
  .then(users => {
    return users.map(user => 
      user.active ? <div>Ativo: {user.name}</div> : null
    );
  });
