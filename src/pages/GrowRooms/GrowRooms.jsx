import React, { useState, useMemo, useCallback } from 'react';
import {
  GrowRoomHeader,
  GrowRoomStatsStrip,
  GrowRoomFilters,
  GrowRoomGrid,
  AddRoomModal,
  YieldOverview,
  MOCK_GROW_ROOMS,
} from '../../components/GrowRooms';
import { useDebounce } from '../../hooks/useDebounce';

const GrowRooms = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cropFilter, setCropFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Debounce search to avoid filtering on every keystroke
  const debouncedSearch = useDebounce(searchQuery, 300);

  const openModal = useCallback(() => setShowAddModal(true), []);
  const closeModal = useCallback(() => setShowAddModal(false), []);
  const handleStatusChange = useCallback((s) => setStatusFilter(s), []);
  const handleCropChange = useCallback((c) => setCropFilter(c), []);

  // Get unique crop types for filter
  const cropTypes = useMemo(() => {
    return [...new Set(MOCK_GROW_ROOMS.map(r => r.crop))];
  }, []);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return MOCK_GROW_ROOMS.filter(room => {
      const matchesSearch =
        room.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        room.id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        room.crop.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || room.status === statusFilter;
      const matchesCrop = cropFilter === 'all' || room.crop === cropFilter;
      return matchesSearch && matchesStatus && matchesCrop;
    });
  }, [debouncedSearch, statusFilter, cropFilter]);

  return (
    <>
      <main className="p-6 md:p-8 space-y-8 flex-1">
        {/* Page Header with Add Room Button */}
        <GrowRoomHeader onAddRoom={openModal} />

        {/* Stats Overview Strip */}
        <GrowRoomStatsStrip />

        {/* Search & Filters Bar */}
        <GrowRoomFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          cropFilter={cropFilter}
          onCropChange={handleCropChange}
          cropTypes={cropTypes}
          totalRooms={MOCK_GROW_ROOMS.length}
          filteredCount={filteredRooms.length}
        />

        {/* Room Cards Grid */}
        <GrowRoomGrid rooms={filteredRooms} />

        {/* Yield Prediction Summary */}
        <YieldOverview />
      </main>

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={showAddModal}
        onClose={closeModal}
      />
    </>
  );
};

export default GrowRooms;
