import { useEffect, useState } from 'react';
import { AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';

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
    <div className="w-full my-4 flex gap-1 justify-between items-center">
      <div className="flex gap-2">
        <div className="relative">
          <select
            className="w-[140px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
            onChange={e => setPersonaId(e.target.value)}
            value={personaId}>
            <option value="">Select Persona</option>
            {personas.map(({ _id, job }: { _id: string; job: string }) => (
              <option key={_id} value={_id}>
                {job || _id}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <div className="relative">
          <select
            className="w-[140px] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 appearance-none"
            onChange={e => setCommentTypeId(e.target.value)}
            value={commentTypeId}>
            <option value="">Comment Type</option>
            {commentTypes.map(({ _id, name }) => (
              <option key={_id} value={_id}>
                {name || _id}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      {/* <button onClick={initiateGenerate} className="text-black px-4 py-2 rounded-full border-8 border-red-600">
        {isGenerating ? 'Generating...' : 'Generate'}
      </button> */}
      <div className="relative inline-block p-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500">
        <button onClick={initiateGenerate} className="text-black px-4 py-2 rounded-full bg-white flex items-center">
          <AutoAwesomeIcon className="mr-2" />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
}
