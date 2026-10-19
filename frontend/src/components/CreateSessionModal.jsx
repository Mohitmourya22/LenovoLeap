import { Code2Icon, LoaderIcon, PlusIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

function CreateSessionModal({
  isOpen,
  onClose,
  roomConfig,
  setRoomConfig,
  onCreateRoom,
  isCreating,
}) {
  const problems = Object.values(PROBLEMS);
  const inviteLink = roomConfig.sessionId ? `${window.location.origin}/session/${roomConfig.sessionId}` : "Generated after creation";

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-2xl mb-6">Create New Session</h3>

        <div className="space-y-8">
          {/* PROBLEM SELECTION */}
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold">Select Problem</span>
              <span className="label-text-alt text-error">*</span>
            </label>

            <select
              className="select w-full"
              value={roomConfig.problem}
              onChange={(e) => {
                const selectedProblem = problems.find((p) => p.title === e.target.value);
                setRoomConfig({
                  difficulty: selectedProblem.difficulty,
                  problem: e.target.value,
                });
              }}
            >
              <option value="" disabled>
                Choose a coding problem...
              </option>

              {problems.map((problem) => (
                <option key={problem.id} value={problem.title}>
                  {problem.title} ({problem.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold">Difficulty</span>
              </label>
              <select
                className="select w-full"
                value={roomConfig.difficulty}
                onChange={(e) => setRoomConfig((current) => ({ ...current, difficulty: e.target.value }))}
              >
                <option value="">Choose difficulty...</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold">Invite Link</span>
              </label>
              <input className="input w-full" value={inviteLink} readOnly />
            </div>
          </div>

          <div className="space-y-3">
            <label className="label">
              <span className="label-text font-semibold">Session Type</span>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { value: "public", title: "Public", description: "Anyone can join" },
                { value: "private", title: "Private", description: "Invite only" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-2xl border p-4 text-left transition ${
                    roomConfig.visibility === option.value
                      ? "border-primary bg-primary/10"
                      : "border-base-300 bg-base-100 hover:border-primary/40"
                  }`}
                  onClick={() => setRoomConfig((current) => ({ ...current, visibility: option.value }))}
                >
                  <div className="font-semibold">{option.title}</div>
                  <div className="text-sm text-base-content/60">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ROOM SUMMARY */}
          {roomConfig.problem && (
            <div className="alert alert-success">
              <Code2Icon className="size-5" />
              <div>
                <p className="font-semibold">Room Summary:</p>
                <p>
                  Problem: <span className="font-medium">{roomConfig.problem}</span>
                </p>
                <p>
                  Difficulty: <span className="font-medium">{roomConfig.difficulty || "Easy"}</span>
                </p>
                <p>
                  Visibility: <span className="font-medium">{roomConfig.visibility || "public"}</span>
                </p>
                <p>
                  Max Participants: <span className="font-medium">2 (1-on-1 session)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn btn-primary gap-2"
            onClick={onCreateRoom}
            disabled={isCreating || !roomConfig.problem}
          >
            {isCreating ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : (
              <PlusIcon className="size-5" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
