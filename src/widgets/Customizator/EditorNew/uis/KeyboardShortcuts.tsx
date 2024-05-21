import { keyboardCommands } from '@/widgets/Customizator/EditorNew/utils';

type PropTypes = {
  isShown: boolean;
  handleClose: (closed: boolean) => void;
};
export const KeyboardShortcuts = ({ isShown, handleClose }: PropTypes) => {
  if (!isShown) return null;

  return (
    <div
      className="h-screen w-screen fixed top-0 flex flex-col items-center left-0 justify-center bg-black/50 overflow-hidden z-40"
      onClick={(e) => {
        e.stopPropagation();
        handleClose(true);
      }}
    >
      <div className="flex flex-col gap-2 w-52 bg-white rounded-3xl p-5">
        <span className="text-black font-bold">Keyboard shortcuts</span>
        {keyboardCommands().map(({ name, keys }) => (
          <div key={name} className="flex flex-row justify-between border-b">
            <span className="text-[#595959]">{name}</span>
            <span>{keys}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
