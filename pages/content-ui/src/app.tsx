import { useEffect, useState } from 'react';

export default function App() {
  const [personaId, setPersonaId] = useState('select');
  const [commentTypeId, setCommentTypeId] = useState('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [commentTypes, setCommentTypes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const { selectedPersonaId, selectedCommentTypeId } = await chrome.storage.sync.get([
        'selectedPersonaId',
        'selectedCommentTypeId',
      ]);

      setPersonaId(selectedPersonaId || 'select');
      setCommentTypeId(selectedCommentTypeId || 'select');
    };

    loadData();

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'commentGenerationDone') {
        setIsGenerating(false);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.onChanged.addListener(changes => {
      if (changes.personas) {
        setPersonas(changes.personas.newValue || []);
      }

      if (changes.commentTypes) {
        setCommentTypes(changes.commentTypes.newValue || []);
      }
    });

    chrome.storage.local.get(['personas', 'commentTypes']).then(({ personas, commentTypes }) => {
      setPersonas(personas || []);
      setCommentTypes(commentTypes || []);
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.set({ selectedPersonaId: personaId });
  }, [personaId]);

  useEffect(() => {
    console.log('commentTypeId: ', commentTypeId);
    chrome.storage.sync.set({ selectedCommentTypeId: commentTypeId });
  }, [commentTypeId]);

  const initiateGenerate = () => {
    if (personaId === 'select' || commentTypeId === 'select') {
      alert('Please select persona and comment type');
      return;
    }

    setIsGenerating(true);
    chrome.runtime.sendMessage({ action: 'initiateGenerate' });
  };

  return (
    <div className="w-full my-4 flex gap-1 text-blue-500 justify-between">
      <select
        className="border border-gray-300 rounded-md"
        onChange={e => setPersonaId(e.target.value)}
        value={personaId}>
        <option value="select">Select Persona</option>
        {personas.map(({ _id, job }: { _id: string; job: string }) => (
          <option key={_id} value={_id}>
            {job || _id}
          </option>
        ))}
      </select>

      <select
        className="border border-gray-300 rounded-md"
        onChange={e => setCommentTypeId(e.target.value)}
        value={commentTypeId}>
        <option value="select">Select Type</option>
        {commentTypes.map(({ _id, name }) => (
          <option key={_id} value={_id}>{name || _id}</option>
        ))}
      </select>

      <button onClick={initiateGenerate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
    </div>
  );
}
