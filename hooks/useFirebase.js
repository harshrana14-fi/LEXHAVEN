// hooks/useFirebase.js
import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase'; 

// Hook for company data
export const useCompanyData = (companyId) => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyData = async () => {
      try {
        const companyRef = doc(db, 'companies', companyId);
        const companyDoc = await getDoc(companyRef);
        
        if (companyDoc.exists()) {
          setCompanyData({ id: companyDoc.id, ...companyDoc.data() });
        } else {
          setError('Company not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const updateCompanyData = async (data) => {
    try {
      const companyRef = doc(db, 'companies', companyId);
      await updateDoc(companyRef, data);
      setCompanyData(prev => ({ ...prev, ...data }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { companyData, loading, error, updateCompanyData };
};

// Hook for applications
export const useApplications = (companyId) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'applications'),
      where('companyId', '==', companyId),
      orderBy('appliedDate', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const applicationsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(applicationsData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const updateApplicationStatus = async (applicationId, status) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, { status });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { applications, loading, error, updateApplicationStatus };
};

// Hook for job posts
export const useJobPosts = (companyId) => {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'jobPosts'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const jobsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setJobPosts(jobsData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const addJobPost = async (jobData) => {
    try {
      const docRef = await addDoc(collection(db, 'jobPosts'), {
        ...jobData,
        companyId,
        createdAt: new Date(),
        status: 'active'
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const updateJobPost = async (jobId, data) => {
    try {
      const jobRef = doc(db, 'jobPosts', jobId);
      await updateDoc(jobRef, data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteJobPost = async (jobId) => {
    try {
      const jobRef = doc(db, 'jobPosts', jobId);
      await deleteDoc(jobRef);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { 
    jobPosts, 
    loading, 
    error, 
    addJobPost, 
    updateJobPost, 
    deleteJobPost 
  };
};

// Hook for internship posts
export const useInternshipPosts = (companyId) => {
  const [internshipPosts, setInternshipPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'internshipPosts'),
      where('companyId', '==', companyId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const internshipsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInternshipPosts(internshipsData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const addInternshipPost = async (internshipData) => {
    try {
      const docRef = await addDoc(collection(db, 'internshipPosts'), {
        ...internshipData,
        companyId,
        createdAt: new Date(),
        status: 'active'
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return { 
    internshipPosts, 
    loading, 
    error, 
    addInternshipPost 
  };
};

// Hook for interviews
export const useInterviews = (companyId) => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const q = query(
      collection(db, 'interviews'),
      where('companyId', '==', companyId),
      orderBy('scheduledDate', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const interviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setInterviews(interviewsData);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [companyId]);

  const scheduleInterview = async (interviewData) => {
    try {
      const docRef = await addDoc(collection(db, 'interviews'), {
        ...interviewData,
        companyId,
        createdAt: new Date(),
        status: 'scheduled'
      });
      return docRef.id;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const updateInterviewStatus = async (interviewId, status) => {
    try {
      const interviewRef = doc(db, 'interviews', interviewId);
      await updateDoc(interviewRef, { status });
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return { 
    interviews, 
    loading, 
    error, 
    scheduleInterview, 
    updateInterviewStatus 
  };
};

// Hook for analytics
export const useAnalytics = (companyId) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchAnalytics = async () => {
      try {
        // Fetch applications analytics
        const applicationsQuery = query(
          collection(db, 'applications'),
          where('companyId', '==', companyId)
        );
        const applicationsSnapshot = await getDocs(applicationsQuery);
        
        // Fetch job posts analytics
        const jobPostsQuery = query(
          collection(db, 'jobPosts'),
          where('companyId', '==', companyId)
        );
        const jobPostsSnapshot = await getDocs(jobPostsQuery);

        // Calculate analytics
        const applications = applicationsSnapshot.docs.map(doc => doc.data());
        const jobPosts = jobPostsSnapshot.docs.map(doc => doc.data());

        const analyticsData = {
          totalApplications: applications.length,
          activeJobs: jobPosts.filter(job => job.status === 'active').length,
          pendingApplications: applications.filter(app => app.status === 'pending').length,
          hiredCandidates: applications.filter(app => app.status === 'hired').length,
          applicationsByMonth: calculateApplicationsByMonth(applications),
          topSkills: calculateTopSkills(applications),
          sourceAnalytics: calculateSourceAnalytics(applications)
        };

        setAnalytics(analyticsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [companyId]);

  const calculateApplicationsByMonth = (applications) => {
    // Implementation for calculating applications by month
    const monthCounts = {};
    applications.forEach(app => {
      const month = new Date(app.appliedDate).toLocaleString('default', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return monthCounts;
  };

  const calculateTopSkills = (applications) => {
    // Implementation for calculating top skills
    const skillCounts = {};
    applications.forEach(app => {
      if (app.skills) {
        app.skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      }
    });
    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const calculateSourceAnalytics = (applications) => {
    // Implementation for calculating source analytics
    const sourceCounts = {};
    applications.forEach(app => {
      const source = app.source || 'Direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    return sourceCounts;
  };

  return { analytics, loading, error };
};