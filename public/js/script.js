// Form validation helper
document.addEventListener('DOMContentLoaded', function() {
  // Add event listener to all forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = 'red';
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (!valid) {
        e.preventDefault();
        alert('Please fill in all required fields');
      }
    });
  });

  // Image preview for uploads
  const imageUploads = document.querySelectorAll('input[type="file"][accept="image/*"]');
  imageUploads.forEach(upload => {
    upload.addEventListener('change', function(e) {
      const previewId = this.dataset.preview;
      if (!previewId) return;
      
      const preview = document.getElementById(previewId);
      if (!preview) return;
      
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.addEventListener('load', function() {
          preview.src = reader.result;
          preview.style.display = 'block';
        });
        
        reader.readAsDataURL(file);
      }
    });
  });
});