export const mockProfileData = {
    name: 'Maksym',
    surname: 'Bobonych',
    email: 'test@mail.com',
    avatarUrl: '/assets/default.png',
};

export const mockEntriesData = [
    { id: 1, date: '2025-11-30', mood: '🙂', text: 'Good day', tag: 'Work' },
    { id: 2, date: '2025-11-29', mood: '😔', text: 'Bad day', tag: 'Sleep' },
];

export const mockContent = {
    tips: [{id:1, text:'Test Tip'}],
    films: [{id:1, title:'Test Film'}]
};

export const mockApiHooks = {
    useAuth: () => ({ 
        isAuth: true, 
        login: () => {}, 
        logout: () => {} 
    }),
    useProfile: () => ({ 
        profile: mockProfileData, 
        isLoading: false, 
        refetch: () => {} 
    }),
    useDiaryEntries: () => ({ 
        entries: mockEntriesData, 
        isLoading: false, 
        refetch: () => {}, 
        moodGraphData: [] 
    }),
    useContent: () => ({ content: mockContent, isLoading: false }),
    usePostEntry: () => ({ 
        isPosting: false, 
        postEntry: () => {} 
    }),

    useRegister: () => ({ isRegistering: false, register: () => {} }),
};