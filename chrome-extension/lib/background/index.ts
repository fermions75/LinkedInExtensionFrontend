import 'webextension-polyfill';

import { generateCommentFromTemplate, sendCommentDelta } from './api';

const generateComment = async (
  {
    postHeader,
    postContent,
    commentThread,
    replyingTo,
  }: {
    postHeader: string;
    postContent: string;
    commentThread: string | null;
    replyingTo: string;
  },
  tabId: number,
) => {
  const { selectedPersonaId, selectedCommentTypeId } = await chrome.storage.sync.get([
    'selectedPersonaId',
    'selectedCommentTypeId',
  ]);

  const { commentTypes } = await chrome.storage.local.get('commentTypes');
  const commentTypePrompt = commentTypes.find((ct: any) => ct._id === selectedCommentTypeId)?.prompt; 
  console.log('commentTypePrompt: ', commentTypePrompt, selectedCommentTypeId, commentTypes);



  let template = `
    POST HEADER: 
    ${postHeader}
    ------------------------------
    POST CONTENT: 
    ${postContent}
    ------------------------------
  `;

  if (commentThread) {
    template += `
      COMMENT THREAD:
      ${commentThread}
      ------------------------------
      `;
  }

  template += `
    REPLYING TO: 
    ${replyingTo}
  `;

  if (commentTypePrompt) {
    template += `\n\n${commentTypePrompt}`;
  }


  ////generate comment
  sendCommentDelta('<clear>', tabId);

  // mock
  //  for (let i = 0; i < 3; i++) {
  //    let comment = 'word' + i;
  //    sendCommentDelta(comment, tabId);
  //    await new Promise(resolve => setTimeout(resolve, 200));
  //    sendCommentDelta(' ', tabId);
  //    await new Promise(resolve => setTimeout(resolve, 200));
  //  }

  await generateCommentFromTemplate(template, selectedPersonaId, selectedCommentTypeId, tabId);

  sendCommentDelta('<end>', tabId);

  // done generating comment
  chrome.tabs.sendMessage(tabId, { action: 'commentGenerationDone' });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log('Request: ', request);
  if (request.action === 'initiateGenerate') {
    if (sender.tab?.id === undefined) return;
    chrome.tabs.sendMessage(sender.tab.id as number, { action: 'getDataForCommentGeneration' });
  } else if (request.action === 'commentGenerationData') {
    generateComment(request.data, sender?.tab?.id || 0);
  }
});
