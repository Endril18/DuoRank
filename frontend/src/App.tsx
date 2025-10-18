const user = {
  name: 'Tiago',
  imageUrl: 'https://simg-ssl.duolingo.com/ssr-avatars/1181272028/SSR-ktlfTAg7BH/large',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Foto de ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}