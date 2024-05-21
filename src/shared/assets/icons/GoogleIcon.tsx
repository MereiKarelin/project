interface IProps {
  className?: string;
}

const GoogleIcon = ({ className }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M23.001 12.7336C23.001 11.8702 22.9296 11.2402 22.7748 10.5869H12.7153V14.4835H18.62C18.501 15.4519 17.8582 16.9102 16.4296 17.8902L16.4096 18.0206L19.5902 20.4354L19.8106 20.4569C21.8343 18.6252 23.001 15.9302 23.001 12.7336Z"
        fill="#4285F4"
      />
      <path
        d="M12.714 22.9996C15.6068 22.9996 18.0353 22.0662 19.8092 20.4562L16.4282 17.8895C15.5235 18.5078 14.3092 18.9395 12.714 18.9395C9.88069 18.9395 7.47596 17.1079 6.61874 14.5762L6.49309 14.5866L3.18583 17.095L3.14258 17.2128C4.90446 20.6428 8.5235 22.9996 12.714 22.9996Z"
        fill="#34A853"
      />
      <path
        d="M6.62046 14.5765C6.39428 13.9232 6.26337 13.2231 6.26337 12.4998C6.26337 11.7764 6.39428 11.0765 6.60856 10.4231L6.60257 10.284L3.25386 7.73535L3.14429 7.78642C2.41814 9.20977 2.00146 10.8081 2.00146 12.4998C2.00146 14.1915 2.41814 15.7897 3.14429 17.2131L6.62046 14.5765Z"
        fill="#FBBC05"
      />
      <path
        d="M12.7141 6.05997C14.7259 6.05997 16.083 6.91163 16.8569 7.62335L19.8807 4.73C18.0236 3.03834 15.6069 2 12.7141 2C8.52353 2 4.90447 4.35665 3.14258 7.78662L6.60686 10.4233C7.47598 7.89166 9.88073 6.05997 12.7141 6.05997Z"
        fill="#EB4335"
      />
    </svg>
  );
};

export default GoogleIcon;
