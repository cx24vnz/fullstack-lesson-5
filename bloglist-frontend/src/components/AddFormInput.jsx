function AddFormInput({ value, name, setter }) {
  return (
    <div>
      {name}
      <input
        type="text"
        value={value}
        name={name}
        onChange={({ target }) => setter(target.value)}
        id={name}
      />
    </div>
  );
}

export default AddFormInput;
