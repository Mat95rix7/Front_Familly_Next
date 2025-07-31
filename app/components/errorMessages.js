export const validateField = (name, value) => {
    switch (name) {
      
      case 'username':
        if (!value) return '';
        if (value.length < 3) return 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
        if (value.length > 20) return 'Le nom d\'utilisateur ne doit pas dépasser 20 caractères';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) return "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et _";
        return '';
        
        case 'actualPassword':
          if (!value) return "Le mot de passe actuel est requis";
          return '';
        
        case 'confirmPassword':
          if (!value) return "La confirmation du mot de passe est requise";
          return '';
  
      case 'email':
        if (!value) return '';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Veuillez entrer une adresse email valide';
        }
        return '';
  
      case 'password':
        if (value.length < 8) {
          return 'Le mot de passe doit contenir au moins 8 caractères';
        }
        if (!/[A-Z]/.test(value)) {
          return 'Le mot de passe doit contenir au moins une majuscule';
        }
        if (!/[0-9]/.test(value)) {
          return 'Le mot de passe doit contenir au moins un chiffre';
        }
        return '';
      default:
        return '';
    }
  };

  export const validateInputChange = (name, value, formData, errors) => {
    const newErrors = { ...errors };
    let processedValue = value;
  
    // Limiter le nombre de chiffres
    if (name === 'ecrans' && value.length > 3) {
      processedValue = value.slice(0, 3);
    } else if (name === 'fauteuils' && value.length > 5) {
      processedValue = value.slice(0, 5);
    } else if (name === 'dep' && value.length > 2) {
      processedValue = value.slice(0, 2);
    } else if (name === 'code_insee' && value.length > 5) {
      processedValue = value.slice(0, 5);
    }
  
    switch (name) {
      case 'nom':
        if (value.length > 100) {
          newErrors.nom = 'Le nom du cinéma ne doit pas dépasser 100 caractères.';
        } else {
          newErrors.nom = '';
        }
        break;
      case 'adresse':
        if (value.length > 200) {
          newErrors.adresse = "L'adresse ne doit pas dépasser 200 caractères.";
        } else {
          newErrors.adresse = '';
        }
        break;
      case 'commune':
        if (value.length > 100) {
          newErrors.commune = 'La commune ne doit pas dépasser 100 caractères.';
        } else {
          newErrors.commune = '';
        }
        break;
      case 'dep':
        if (processedValue === '00') {
          newErrors.dep = "Le département 00 n'est pas valide.";
        } else if (processedValue && !/^\d*$/.test(processedValue)) {
          newErrors.dep = "Le département ne doit contenir que des chiffres.";
        } else if (processedValue && processedValue.length === 2) {
          // Validation complète uniquement si le champ est rempli avec 2 chiffres
          if (formData.code_insee && formData.code_insee.length === 5 && 
              parseInt(formData.code_insee.substring(0, 2), 10) !== parseInt(processedValue, 10)) {
            newErrors.dep = '';  // On ne met pas d'erreur ici, seulement dans code_insee
            newErrors.code_insee = `Le code postal (${formData.code_insee}) ne correspond pas au département (${processedValue}).`;
          } else {
            newErrors.dep = '';
            if (formData.code_insee && formData.code_insee.length === 5 && 
                parseInt(formData.code_insee.substring(0, 2), 10) === parseInt(processedValue, 10)) {
              newErrors.code_insee = '';
            }
          }
        } else {
          newErrors.dep = '';
        }
        break;
      case 'code_insee':
        if (processedValue && !/^\d*$/.test(processedValue)) {
          newErrors.code_insee = "Le code postal ne doit contenir que des chiffres.";
        } else if (processedValue && processedValue.length === 5) {
          // Vérifier si les deux premiers chiffres correspondent à "00", ce qui est invalide
          if (processedValue.substring(0, 2) === '00') {
            newErrors.code_insee = "Le code postal ne peut pas commencer par 00.";
          }
          // Validation complète uniquement si le champ est rempli avec 5 chiffres
          else if (formData.dep && formData.dep.length === 2 && 
              parseInt(processedValue.substring(0, 2), 10) !== parseInt(formData.dep, 10)) {
            newErrors.code_insee = `Le code postal (${processedValue}) ne correspond pas au département (${formData.dep}).`;
          } else {
            newErrors.code_insee = '';
            if (formData.dep && formData.dep.length === 2 && 
                parseInt(processedValue.substring(0, 2), 10) === parseInt(formData.dep, 10)) {
              newErrors.dep = '';
            }
          }
        } else {
          newErrors.code_insee = '';
        }
        break;
      case 'ecrans':
        if (value && !/^\d*$/.test(value)) {
          newErrors.ecrans = "Le nombre d'écrans doit être un nombre entier.";
        } else if (value.length > 3) {
          newErrors.ecrans = "Le nombre d'écrans ne doit pas dépasser 3 chiffres.";
        } else {
          newErrors.ecrans = '';
        }
        break;
      case 'fauteuils':
        if (value && !/^\d*$/.test(value)) {
          newErrors.fauteuils = 'Le nombre de fauteuils doit être un nombre entier.';
        } else if (value.length > 5) {
          newErrors.fauteuils = 'Le nombre de fauteuils ne doit pas dépasser 5 chiffres.';
        } else {
          newErrors.fauteuils = '';
        }
        break;
      default:
        break;
    }
  
    return { processedValue, newErrors };
  };
  
  // Validation complète à la soumission
  export const validateFormSubmission = (formData) => {
    const submissionErrors = {};
    
    // Vérification des champs obligatoires
    if (!formData.nom || formData.nom.trim() === '') {
      submissionErrors.nom = 'Le nom du cinéma est obligatoire.';
    } else if (formData.nom.length > 100) {
      submissionErrors.nom = 'Le nom du cinéma ne doit pas dépasser 100 caractères.';
    }
    
    if (!formData.adresse || formData.adresse.trim() === '') {
      submissionErrors.adresse = "L'adresse est obligatoire.";
    } else if (formData.adresse.length > 200) {
      submissionErrors.adresse = "L'adresse ne doit pas dépasser 200 caractères.";
    }
    
    if (!formData.commune || formData.commune.trim() === '') {
      submissionErrors.commune = 'La commune est obligatoire.';
    } else if (formData.commune.length > 100) {
      submissionErrors.commune = 'La commune ne doit pas dépasser 100 caractères.';
    }
    
    // Validation du département
    if (!formData.dep) {
      submissionErrors.dep = "Le département est requis.";
    } else if (!/^\d{2}$/.test(formData.dep)) {
      submissionErrors.dep = "Le département doit contenir 2 chiffres.";
    } else if (formData.dep === '00') {
      submissionErrors.dep = "Le département 00 n'est pas valide.";
    }
    
    // Validation du code INSEE/code postal
    if (!formData.code_insee) {
      submissionErrors.code_insee = "Le code postal est requis.";
    } else if (!/^\d{5}$/.test(formData.code_insee)) {
      submissionErrors.code_insee = "Le code postal doit contenir exactement 5 chiffres.";
    } else if (formData.code_insee.substring(0, 2) === '00') {
      submissionErrors.code_insee = "Le code postal ne peut pas commencer par 00.";
    }
    
    // Vérification de la correspondance département/code postal
    if (formData.dep && formData.code_insee && 
        formData.dep.length === 2 && formData.code_insee.length === 5 &&
        parseInt(formData.code_insee.substring(0, 2), 10) !== parseInt(formData.dep, 10)) {
      submissionErrors.code_insee = `Le code postal (${formData.code_insee}) ne correspond pas au département (${formData.dep}).`;
    }
    
    // Validation des champs numériques
    if (formData.ecrans !== undefined && formData.ecrans !== '') {
      if (!/^\d+$/.test(formData.ecrans) || parseInt(formData.ecrans, 10) < 0) {
        submissionErrors.ecrans = "Le nombre d'écrans doit être un nombre entier positif ou nul.";
      } else if (formData.ecrans.length > 3) {
        submissionErrors.ecrans = "Le nombre d'écrans ne doit pas dépasser 3 chiffres.";
      }
    }
    
    if (formData.fauteuils !== undefined && formData.fauteuils !== '') {
      if (!/^\d+$/.test(formData.fauteuils) || parseInt(formData.fauteuils, 10) < 0) {
        submissionErrors.fauteuils = "Le nombre de fauteuils doit être un nombre entier positif ou nul.";
      } else if (formData.fauteuils.length > 5) {
        submissionErrors.fauteuils = "Le nombre de fauteuils ne doit pas dépasser 5 chiffres.";
      }
    }
    
    return submissionErrors;
  };