import React from "react";

type Props = {
	onChange?: (audioURL: Nullable<string>) => void;
	defaultValue?: Nullable<string>;
	onRecordStart?: () => void;
	onRecordStop?: () => void;
	enableUpload?: boolean;
	onUpload?: (file: File) => void;
};

type Time = {
	minutes: number;
	seconds: number;
};

function AudioRecorder({ onChange, defaultValue, enableUpload, onUpload, onRecordStart, onRecordStop }: Props) {
	const [isRecording, setIsRecording] = React.useState(false);
	const [timer, setTimer] = React.useState<Nullable<Time>>(null);
	const [audioURL, setAudioURL] = React.useState<string | null>(defaultValue || null);

	const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	React.useEffect(() => {
		if (!defaultValue || audioURL) return;
		setAudioURL(defaultValue);
	}, [defaultValue]);

	React.useEffect(() => {
		onChange?.(audioURL);
	}, [audioURL]);

	const startRecording = async () => {
		setIsRecording(true);
		setTimer({ minutes: 0, seconds: 0 });
		intervalRef.current = setInterval(() => {
			setTimer((timer) => {
				timer = timer || { minutes: 0, seconds: 0 };
				if (timer.seconds >= 59) {
					return { minutes: timer.minutes + 1, seconds: 0 };
				} else {
					return { ...timer, seconds: timer.seconds + 1 };
				}
			});
		}, 1000);
		// ONSTART
	};

	const stopRecording = async () => {
		setIsRecording(false);
		setTimer(null);
		clearInterval(intervalRef.current!);
		// ONSTOP
		setAudioURL("");
	};

	return (
		<div className="flex gap-2 items-start">
			<div className="flex flex-col gap-2 items-center justify-start">
				<div className="flex items-start">
					<div className="flex flex-col items-center">
						<div
							onClick={isRecording ? stopRecording : startRecording}
							data-tooltip-id="gen"
							data-tooltip-content={isRecording ? "Parar gravação" : "Iniciar gravação"}
							className={`rounded-full p-4 flex items-center justify-center cursor-pointer border-2 ${isRecording ? "bg-wpp-ptt-draft-button-send text-wpp-primary-strong" : "text-wpp-icon"}`}
						>
							{/* {isRecording ? <AiOutlineAudio className="h-6 w-6" /> : <AiFillAudio className="h-6 w-6" />} */}
							{isRecording ? "PARAR DE GRAVAR" : "GRAVAR"}
						</div>
						{timer ? (
							<div>
								{timer.minutes.toString().padStart(2, "0")}:{timer.seconds.toString().padStart(2, "0")}
							</div>
						) : null}
					</div>
					<div>
						<div
							data-tooltip-id="gen"
							data-tooltip-content="Fazer upload de um arquivo de áudio"
							onClick={() => inputRef.current?.click()}
							className="rounded-full p-4 flex items-center justify-center cursor-pointer border-2 text-wpp-icon"
						>
							{/* <FaRegFileAudio className="h-6 w-6" /> */}
							UPLOAD
						</div>
						<input
							type="file"
							accept="audio/*"
							className="hidden"
							ref={inputRef}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) {
									const url = URL.createObjectURL(file);
									setAudioURL(url);
								}
							}}
						/>
					</div>
					{audioURL && (
						<div
							data-tooltip-id="gen"
							data-tooltip-content="Remover"
							className="rounded-full p-4 flex items-center justify-center cursor-pointer border-2 text-wpp-ptt-draft-button-stop"
							onClick={() => {
								setAudioURL(null);
							}}
						>
							{/* <IoMdTrash className="h-6 w-6" /> */}
							EXCLUIR
						</div>
					)}
				</div>
			</div>
			<div>
				{audioURL && (
					<>
						<audio controls src={audioURL} className="max-w-full" />
					</>
				)}
			</div>
		</div>
	);
}

export default AudioRecorder;
