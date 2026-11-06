import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import SearchBar from './components/SearchBar';
import StudentList from './components/StudentList';
import StudentModal from './components/StudentModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import {
  fetchEtudiants,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
} from './services/api';

export default function App() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    student: null,
    isDeleting: false,
  });

  // Notifications Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Chargement des étudiants
  const loadStudents = useCallback(async (searchQuery = '') => {
    try {
      setIsLoading(true);
      const data = await fetchEtudiants(searchQuery);
      setStudents(data);
    } catch (err) {
      showToast('Impossible de charger la liste des étudiants.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Chargement initial et gestion de la recherche avec léger debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadStudents(searchTerm);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, loadStudents]);

  // Ouverture du modal en mode Ajout
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsModalOpen(true);
  };

  // Ouverture du modal en mode Édition
  const handleOpenEditModal = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  // Soumission (Ajout ou Modification)
  const handleSubmitStudent = async (formData, studentId) => {
    if (studentId) {
      // Modification
      await updateEtudiant(studentId, formData);
      showToast(`L'étudiant ${formData.prenom} ${formData.nom} a été mis à jour avec succès.`);
    } else {
      // Ajout
      await createEtudiant(formData);
      showToast(`L'étudiant ${formData.prenom} ${formData.nom} a été ajouté avec succès.`);
    }
    await loadStudents(searchTerm);
  };

  // Ouverture du modal de confirmation de suppression
  const handleOpenDeleteModal = (student) => {
    setDeleteModalState({
      isOpen: true,
      student,
      isDeleting: false,
    });
  };

  // Confirmation de suppression
  const handleConfirmDelete = async (studentId) => {
    try {
      setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));
      await deleteEtudiant(studentId);
      showToast("L'étudiant a été supprimé définitivement.");
      setDeleteModalState({ isOpen: false, student: null, isDeleting: false });
      await loadStudents(searchTerm);
    } catch (err) {
      showToast("Erreur lors de la suppression de l'étudiant.", 'error');
      setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  return (
    <div className="app-container">
      {/* 1. En-tête */}
      <Header />

      {/* 2. Tableau de bord : Statistiques (Total d'étudiants, filières...) */}
      <DashboardStats students={students} />

      {/* 3. Barre de recherche et bouton d'action */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* 4. Tableau d'affichage des étudiants */}
      <StudentList
        students={students}
        isLoading={isLoading}
        onEditStudent={handleOpenEditModal}
        onDeleteStudent={handleOpenDeleteModal}
      />

      {/* 5. Modale d'ajout / modification */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitStudent}
        studentToEdit={studentToEdit}
      />

      {/* 6. Modale de confirmation de suppression */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        student={deleteModalState.student}
        isDeleting={deleteModalState.isDeleting}
        onClose={() =>
          setDeleteModalState({ isOpen: false, student: null, isDeleting: false })
        }
        onConfirm={handleConfirmDelete}
      />

      {/* 7. Notifications flottantes */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

