
export const sendCommentDelta = (delta, tabId) => {
    chrome.tabs.sendMessage(tabId, { action: 'generatedCommentDelta', delta });
};


export const generateCommentFromTemplate = async (template, personaId, commentTypeId, targetTabId) => {

    const { authInfo } = await chrome.storage.local.get('authInfo');


    try {
        const response = await fetch('https://algoclan-extension-46b54a91a23b.herokuapp.com/api/ai/comment', {
            method: 'POST',
            headers: {
                'Accept': 'text/event-stream',
                'Authorization': `Bearer ${authInfo.token}`,
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({
                personaId,
                linkedinPost: template
            })
        });



        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        console.log('response', response);

        //await solution to get the full response
        let breakLoop = false;
        while (!breakLoop) {
            const { done, value } = await reader.read();
            const text = decoder.decode(value);
            console.log(text);
            sendCommentDelta(text, targetTabId);
            if (done) {
                breakLoop = true;
            }
            // Otherwise do something here to process current chunk
        }


    }
    catch (e) {
        console.log({ e });

    }
}