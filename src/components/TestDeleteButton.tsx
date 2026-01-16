

// Test component to verify delete functionality
const TestDeleteButton = () => {
    const testDelete = () => {
        console.log('Delete button clicked!');
        const confirmMessage = 'Are you sure you want to delete this test member?\n\nTest Member';

        if (window.confirm(confirmMessage)) {
            console.log('User confirmed deletion');
            // Simulate deletion
            alert('Delete would happen here');
        } else {
            console.log('User cancelled deletion');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Test Delete Button</h2>
            <button
                onClick={testDelete}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Test Delete
            </button>
        </div>
    );
};

export default TestDeleteButton;
