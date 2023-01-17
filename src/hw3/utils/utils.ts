export const logError = (error: Error | unknown) => {
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    console.log('Error: unexpected error!');
};
