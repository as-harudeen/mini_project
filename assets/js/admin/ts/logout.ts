const logout = document.getElementById('logout')! as HTMLAnchorElement;
logout.addEventListener('click', async () => {
    const res = await fetch('/admin/logout', {
        method: 'DELETE'
    })
    if (res.ok) window.location.href = '/admin/login'
});